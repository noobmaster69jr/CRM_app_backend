const { mockRequest, mockResponse } = require("../../tests/interceptor");
const {
  update,
  findAll,
  findById,
} = require("../../controllers/user.controller");
const User = require("../../models/user.model");
const interceptor = require("../../tests/interceptor");

const userTestPayload = {
  userType: "CUSTOMER",
  password: "12345678",
  userStatus: "APPROVED",
  name: "Test",
  userId: 1,
  email: "test@gmail.com",
  ticketsCreated: [],
  ticketsAssigned: [],
  exec: jest.fn(),
};

describe("Update", () => {
  it("should fail if no user found", async () => {
    const userSpy = jest
      .spyOn(User, "findOneAndUpdate")
      .mockImplementation(() => ({
        exec: jest.fn().mockReturnValue(null),
      }));
    const req = mockRequest();
    const res = mockResponse();
    req.params = { userId: 1 };
    req.body = userTestPayload;
    await update(req, res);
    expect(userSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      message: "No user with id found!",
    });
  });

  it("should fail due to internal error", async () => {
    const userSpy = jest
      .spyOn(User, "findOneAndUpdate")
      .mockReturnValue((cb) => cb(new Error("This is an error")));
    const req = mockRequest();
    const res = mockResponse();
    req.params = { userId: 1 };
    await update(req, res);
    expect(userSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({
      message: "some internal error occured",
    });
 });

  it("should pass", async () => {
    const userSpy = jest
      .spyOn(User, "findOneAndUpdate")
      .mockImplementation(() => ({
        exec: jest.fn().mockReturnValue(userTestPayload),
      }));
    const req = mockRequest();
    const res = mockResponse();
    req.params = { userId: 1 };
    req.body = userTestPayload;
    await update(req, res);
    expect(userSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      message: `User record has been updated successfully`,
    });
  });
});

describe("Find By Id", () => {
  it("should fail if no user found", async () => {
    const userSpy = jest
      .spyOn(User, "find")
      .mockReturnValue(Promise.resolve([]));
    const req = mockRequest();
    const res = mockResponse();
    req.params = { userId: 1 };
    req.body = userTestPayload;
    await findById(req, res);
    expect(userSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      message: `User with this id [1] is not present`,
    });
  });

  it("should fail due to internal error", async () => {
    const userSpy = jest
      .spyOn(User, "find")
      .mockReturnValue((cb) => cb(new Error("This is an error")), []);
    const req = mockRequest();
    const res = mockResponse();
    req.params = { userId: 1 };
    await findById(req, res);
    expect(userSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({
      message: "Internal Server Error",
    });
  });

  it("should pass", async () => {
    const userSpy = jest
      .spyOn(User, "find")
      .mockReturnValue(Promise.resolve([userTestPayload]));
    const req = mockRequest();
    const res = mockResponse();
    req.params = { userId: 1 };
    await findById(req, res);
    expect(userSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          userType: userTestPayload.userType,
          name: userTestPayload.name,
          userId: userTestPayload.userId,
          email: userTestPayload.email,
          userStatus: userTestPayload.userStatus,
        }),
      ])
    );
  });
});
