import { Request, Response } from "express";
import CustomerModel from "../models/customer";
import { success, error } from "../utils/apiResponse";
import mongoose from "mongoose";
import CarInventoryModel from "../models/carInventory";
import withMongoSession from "../utils/mongoUtils";

/**
 * Get Data List
 * @swagger
 * /customer:
 *  get:
 *    tags:
 *      - customers
 *    summary: Get all customers
 *    description: Get all customers from the data. Specific customer can be searched using the customer cnic and can be sort by the creation date and paginated.
 *    operationId: getAllCustomer
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: query
 *        name: search
 *        description: Filter customers by CNIC
 *        schema:
 *          type: string
 *      - in: query
 *        name: sortBy
 *        description: Field to sort by (e.g., createdAt, updatedAt)
 *        schema:
 *          type: string
 *      - in: query
 *        name: sortOrder
 *        description: Sort order (asc/desc)
 *        schema:
 *          type: string
 *      - in: query
 *        name: pageNumber
 *        description: Page number for pagination
 *        schema:
 *          type: integer
 *          default: 1
 *      - in: query
 *        name: pageSize
 *        description: Number of items per page
 *        schema:
 *          type: integer
 *          default: 3
 *    responses:
 *      '200':
 *        description: Successful response
 *        content:
 *          application/json:
 *            example:
 *              message: Customers fetched successfully,
 *              page: 1,
 *              limit: 3,
 *              totalPages: 1,
 *              totalItems: 1,
 *              data:
 *                _id: "customer_id"
 *                name: "Saad Shahid"
 *                cnic: 3660347880473
 *                address: "Rawalpindi"
 *                contact: "03357735290"
 *                purchaseHistory:
 *                  - chasisNo: "CN09817"
 *                    datePurchase: "2024-01-30T13:51:43.647Z"
 *      '404':
 *        $ref: "#/components/responses/NotFound"
 *      '500':
 *        $ref: "#/components/responses/InternalServer"
 */
const getAllCustomer = async (req: Request, res: Response) => {
  try {
    const { search, sortBy, sortOrder, pageNumber, pageSize } = req.query;

    // Filtering
    const filter: Record<string, any> = {};
    if (search) {
      const isNumeric = /^\d+$/.test(search as string);

      if (isNumeric) {
        filter.cnic = search;
      }
    }

    //Sorting
    let sort: { [field: string]: "asc" | "desc" } = {};
    const sortFields = ["createdAt", "updatedAt"];

    if (sortBy && sortFields.includes(sortBy.toString())) {
      sort = { [sortBy.toString()]: sortOrder === "desc" ? "desc" : "asc" };
    }

    // Pagination
    const page = Math.max(parseInt(pageNumber as string) || 1, 1);
    const limit = Math.max(parseInt(pageSize as string) || 3, 1);

    const skip = (page - 1) * limit;

    let query = CustomerModel.find(filter).sort(sort).skip(skip).limit(limit);

    const data = await query.exec();

    const totalItems = await CustomerModel.countDocuments(filter);

    const totalPages = Math.ceil(totalItems / limit);

    if (data.length === 0) {
      return res.status(404).json(error("Customers not found"));
    }

    return res
      .status(200)
      .json(
        success(
          "Customers fetched successfully",
          data,
          page,
          limit,
          totalPages,
          totalItems
        )
      );
  } catch (err) {
    if (err instanceof Error) {
      res
        .status(500)
        .json(
          error(err.message || "Some error occured while retriving Customers.")
        );
    }
  }
};

/**
 * Get Data by ID
 * @swagger
 * /customer/{id}:
 *  get:
 *    tags:
 *      - customers
 *    summary: Get customer by ID
 *    description: Get a customer using specific ID
 *    operationId: getCustomerById
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: Customer ID
 *        schema:
 *          type: string
 *    responses:
 *      '200':
 *        description: Successful response
 *        content:
 *          application/json:
 *            example:
 *              message: Customers fetched successfully,
 *              data:
 *                _id: "customer_id"
 *                name: "Saad"
 *                cnic: 3660347880473
 *                address: "Rawalpindi"
 *                contact: "03357735290"
 *                purchaseHistory:
 *                  - chasisNo: "CN09817"
 *                    datePurchase: "2024-01-30T13:51:43.647Z"
 *
 *      '400':
 *        $ref: "#/components/responses/InvalidId"
 *      '404':
 *        $ref: "#/components/responses/NotFound"
 *      '500':
 *        $ref: "#/components/responses/InternalServer"
 */
const getCustomerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await CustomerModel.findById(id);

    if (!data) {
      res.status(404).json(error("Customer not Found"));
    } else {
      return res
        .status(200)
        .json(success("Customer fetched successfully", data));
    }
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      res.status(400).json(error("Invalid ObjectId Format"));
    } else {
      if (err instanceof Error) {
        res
          .status(500)
          .json(
            error(
              err.message || "Some error occured while retriving a Customer"
            )
          );
      }
    }
  }
};

/**
 * Add Data
 * @swagger
 * /customer:
 *  post:
 *    tags:
 *      - customers
 *    summary: Create a new customer
 *    description: Create a new car and chasisNo must be unique
 *    operationId: createCustomer
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/Customer"
 *        application/x-www-form-urlencoded:
 *          schema:
 *            $ref: "#/components/schemas/Customer"
 *    responses:
 *      '201':
 *        description: Successful response
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/responses/SuccessResponse"
 *            example:
 *              message: Customer added successfully,
 *              data:
 *                _id: "customer_id"
 *                name: "Saad"
 *                cnic: 3660347880473
 *                address: "Rawalpindi"
 *                contact: "03357735290"
 *                purchaseHistory:
 *                  - chasisNo: "CN09817"
 *                    datePurchase: "2024-01-30T13:51:43.647Z"
 *      '400':
 *        $ref: "#/components/responses/InvalidId"
 *      '404':
 *        $ref: "#/components/responses/NotFound"
 *      '409':
 *        $ref: "#/components/responses/Conflict"
 *      '422':
 *        $ref: "#/components/responses/InvalidInput"
 *      '500':
 *        $ref: "#/components/responses/InternalServer"
 *
 */
const createCustomer = async (req: Request, res: Response) => {
  try {
    await withMongoSession(async (session) => {
      const { purchaseHistory, cnic } = req.body;

      let data = await CustomerModel.findOne({ cnic }).session(session);

      if (!data) {
        const dataArray = await CustomerModel.create([req.body], { session });
        data = dataArray.length > 0 ? dataArray[0] : null;
      } else {
        return res
          .status(409)
          .json(error("Customer with cnic already exists."));
      }

      if (Array.isArray(purchaseHistory)) {
        for (const purchase of purchaseHistory) {
          const { chasisNo } = purchase;

          const existingCar = await CarInventoryModel.findOne({
            chasisNo,
          }).session(session);

          if (existingCar) {
            if (!existingCar.isSold) {
              await CarInventoryModel.findOneAndUpdate(
                { chasisNo },
                { $set: { isSold: true } }
              ).session(session);
            } else {
              return res
                .status(409)
                .json(error("Car with chasis No is already sold."));
            }
          } else {
            return res
              .status(404)
              .json(error("Car with chasis No does not exists."));
          }
        }
      }

      if (data) {
        return res
          .status(201)
          .json(success("Customer added successfully", data));
      }
    });
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      res.status(400).json(error("Invalid ObjectId Format"));
    } else if (err instanceof mongoose.Error.ValidationError) {
      const validationErrors = Object.values(err.errors).map(
        (err) => err.message
      );
      res.status(422).json(error("Validation Error", validationErrors));
    } else {
      if (err instanceof Error) {
        res
          .status(500)
          .json(
            error(err.message || "Some error occured while adding Customer. ")
          );
      }
    }
  }
};

/**
 * Update Data
 * @swagger
 * /customer/{id}:
 *  put:
 *    tags:
 *      - customers
 *    summary: Update customer by ID
 *    description: Customer can be updated using the specific ID with a request body
 *    operationId: updateCustomer
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: Customer ID
 *        schema:
 *          type: string
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/Customer"
 *    responses:
 *      '200':
 *        description: Success
 *        content:
 *          application/json:
 *            example:
 *              message: "Customer updated successfully"
 *              data:
 *                _id: "customer_id"
 *                name: "Saad"
 *                cnic: 3660347880473
 *                address: "Rawalpindi"
 *                contact: "03357735290"
 *                purchaseHistory:
 *                  - chasisNo: "CN09817"
 *                    datePurchase: "2024-01-30T13:51:43.647Z"
 *
 *      '400':
 *        oneof:
 *          $ref: "#/components/responses/InvalidId"
 *      '404':
 *        $ref: "#/components/responses/NotFound"
 *      '409':
 *        $ref: "#/components/responses/Conflict"
 *      '422':
 *        $ref: "#/components/responses/InvalidInput"
 *      '500':
 *        $ref: "#/components/responses/InternalServer"
 */
const updateCustomer = async (req: Request, res: Response) => {
  try {
    await withMongoSession(async (session) => {
      const { id } = req.params;
      const newData = req.body;
      const { cnic, purchaseHistory } = req.body;

      if (Object.keys(newData).length === 0) {
        return res.status(400).json(error("Payload cannot be empty"));
      }

      const existingData = await CustomerModel.findById(id).session(session);

      if (!existingData) {
        return res.status(404).json(error("Customer not found"));
      }

      if (cnic !== existingData.cnic) {
        const isUnique = await CustomerModel.findOne({ cnic })
          .ne("_id", id)
          .session(session);
        if (isUnique) {
          return res.status(409).json(error("Cnic already exists"));
        }
      }

      if (Array.isArray(purchaseHistory)) {
        for (const purchase of purchaseHistory) {
          const { chasisNo } = purchase;

          const existingCar = await CarInventoryModel.findOne({
            chasisNo,
          }).session(session);

          if (existingCar) {
            if (!existingCar.isSold) {
              await CarInventoryModel.findOneAndUpdate(
                { chasisNo },
                { $set: { isSold: true } },
                { session }
              );
            }
          } else {
            return res
              .status(404)
              .json(error("Car with chasis No does not exists."));
          }
        }
      }

      const data = await CustomerModel.findByIdAndUpdate(id, newData, {
        new: true,
        session,
      });

      if (data) {
        return res
          .status(200)
          .json(success("Customer updated succeccfully", data));
      }
    });
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      res.status(400).json(error("Invalid ObjectId Format"));
    } else if (err instanceof mongoose.Error.ValidationError) {
      const validationErrors = Object.values(err.errors).map(
        (err) => err.message
      );
      res.status(422).json(error("Validation Error", validationErrors));
    } else {
      if (err instanceof Error) {
        res
          .status(500)
          .json(
            error(err.message || "Some error occured while updating Customer")
          );
      }
    }
  }
};

/**
 * Delete Data
 * @swagger
 * /customer/{id}/:
 *  delete:
 *    tags:
 *      - customers
 *    summary: Delete customer by ID
 *    description: Customer can be deleted using the specific ID
 *    operationId: deleteCustomer
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: Customer ID
 *        schema:
 *          type: string
 *    responses:
 *      '200':
 *        description: Customer deleted successfully
 *        content:
 *          application/json:
 *            example:
 *              message: "Customer deleted successfully"
 *
 *      '400':
 *        $ref: "#/components/responses/InvalidId"
 *      '404':
 *        $ref: "#/components/responses/NotFound"
 *      '500':
 *        $ref: "#/components/responses/InternalServer"
 */
const deleteCustomer = async (req: Request, res: Response) => {
  try {
    await withMongoSession(async (session) => {
      const { id } = req.params;

      let existingData = await CustomerModel.findById(id).session(session);

      if (!existingData) {
        return res.status(404).json(error("Customer does not exist"));
      }

      if (Array.isArray(existingData.purchaseHistory)) {
        for (const purchase of existingData.purchaseHistory) {
          const { chasisNo } = purchase;

          await CarInventoryModel.deleteMany({ chasisNo }).session(session);
        }
      }

      const data = await CustomerModel.findByIdAndDelete(id);

      return res.status(200).json(success("Customer deleted successfully"));
    });
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      res.status(400).json(error("Invalid ObjectId Format"));
    } else {
      if (err instanceof Error) {
        res
          .status(500)
          .json(
            error(err.message || "Some error occured while deleting Customer")
          );
      }
    }
  }
};

export default {
  getAllCustomer,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
