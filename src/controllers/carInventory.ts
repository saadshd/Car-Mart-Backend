import { Request, Response } from "express";
import CarInventoryModel from "../models/carInventory";
import { success, error } from "../utils/apiResponse";
import mongoose from "mongoose";

/**
 * Get List of Data
 * @swagger
 * /car-inventory:
 *  get:
 *    tags:
 *      - car inventory
 *    summary: Get all cars
 *    description: Get all cars from the data. Specific car can be searched using the car chasisNo, engineNo, registrationNo, registeredIn, make, modelName and can be sort by milage, price, modelYear and paginated.
 *    operationId: getAllCar
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: query
 *        name: search
 *        description: Filter customers by chasisNo, engineNo, registrationNo, registeredIn, make, modelName
 *        schema:
 *          type: string
 *      - in: query
 *        name: sortBy
 *        description: Field to sort by mileage, price, modelYear, createdAt, updatedAt
 *        schema:
 *          type: string
 *      - in: query
 *        name: isSold
 *        description: Field to sort by availability (true, false)
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
 *          minimum: 1
 *      - in: query
 *        name: pageSize
 *        description: Number of items per page
 *        schema:
 *          type: integer
 *          default: 3
 *          minimum: 1
 *    responses:
 *      '200':
 *        description: Successful response
 *        content:
 *          application/json:
 *            example:
 *              message: Customers fetched successfully,
 *              page: 1,
 *              limit: 3,
 *              totalPages: 9,
 *              totalItems: 26,
 *              data:
 *                _id: "car_id"
 *                engineNo: EN09187
 *                chasisNo: CN09187
 *                make: Porsche
 *                modelName: "911"
 *                variant: GT3 RS
 *                price: 100000000
 *                registeredIn: Punjab
 *                registrationNo: VXR 1008
 *                modelYear: 2024
 *                mileage: 1009
 *                fuelType: Petrol
 *                transmissionType: Automatic
 *                taxHistory: Token/Tax Paid
 *                assembly: Local
 *                document:
 *                  - Original Book
 *                  - Fresh Import
 *                image: string
 *                isSold: false
 *      '404':
 *        $ref: "#/components/responses/NotFound"
 *      '500':
 *        $ref: "#/components/responses/InternalServer"
 */
const getAllCar = async (req: Request, res: Response) => {
  try {
    const { search, isSold, sortBy, sortOrder, pageNumber, pageSize } =
      req.query;

    // Filtering
    const filter: any = {};

    const searchFields = [
      "chasisNo",
      "engineNo",
      "registrationNo",
      "registeredIn",
      "make",
      "modelName",
    ];

    if (search) {
      filter.$or = searchFields.map((field) => ({
        [field]: { $regex: new RegExp(search as string, "i") },
      }));
    }

    if (isSold === "true") {
      filter.isSold = true;
    }
    if (isSold === "false") {
      filter.isSold = false;
    }

    // Sorting
    let sort: { [field: string]: "asc" | "desc" } = {};
    const sortFields = [
      "mileage",
      "price",
      "modelYear",
      "createdAt",
      "updatedAt",
    ];

    if (sortBy && sortFields.includes(sortBy.toString())) {
      sort = { [sortBy.toString()]: sortOrder === "desc" ? "desc" : "asc" };
    }

    // Pagination
    const page = Math.max(parseInt(pageNumber as string) || 1, 1);
    const limit = Math.max(parseInt(pageSize as string) || 3, 1);

    const skip = (page - 1) * limit;

    let query = CarInventoryModel.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const data = await query.exec();

    const totalItems = await CarInventoryModel.countDocuments(filter);

    const totalPages = Math.ceil(totalItems / limit);

    if (data.length === 0) {
      return res.status(404).json(error("Cars not found"));
    }

    return res
      .status(200)
      .json(
        success(
          "Cars fetched successfully",
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
        .json(error(err.message || "Some error occured while retriving cars."));
    }
  }
};

/**
 * Get Data by ID
 * @swagger
 * /car-inventory/{id}:
 *  get:
 *    tags:
 *      - car inventory
 *    summary: Get car by ID
 *    description: Get a car using specific id
 *    operationId: getCarById
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: Car ID
 *        schema:
 *          type: string
 *    responses:
 *      '200':
 *        description: Successful response
 *        content:
 *          application/json:
 *            example:
 *              message: Car fetched successfully,
 *              data:
 *                _id: "car_id"
 *                engineNo: EN09187
 *                chasisNo: CN09187
 *                make: Porsche
 *                modelName: "911"
 *                variant: GT3 RS
 *                price: 100000000
 *                registeredIn: Punjab
 *                registrationNo: VXR 1008
 *                modelYear: 2024
 *                mileage: 1009
 *                fuelType: Petrol
 *                transmissionType: Automatic
 *                taxHistory: Token/Tax Paid
 *                assembly: Local
 *                document: 
 *                  - Original Book
 *                  - Fresh Import 
 *                image: string
 *                isSold: false  
 *              
 *      '400':
 *        $ref: "#/components/responses/InvalidId"
 *      '404':
 *        $ref: "#/components/responses/NotFound"
 *      '500':
 *        $ref: "#/components/responses/InternalServer"

 */
const getCarById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await CarInventoryModel.findById(id);

    if (!data) {
      res.status(404).json(error("Car not Found"));
    } else {
      return res.status(200).json(success("Car fetched successfully", data));
    }
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      res.status(400).json(error("Invalid ObjectId Format"));
    } else {
      if (err instanceof Error) {
        res
          .status(500)
          .json(
            error(err.message || "Some error occured while retriving a Car")
          );
      }
    }
  }
};

/**
 * Add Data
 * @swagger
 * /car-inventory:
 *  post:
 *    tags:
 *      - car inventory
 *    summary: Create a new car
 *    description: A new car can be added using a request body with a unqiue chasis number of car.
 *    operationId: createCar
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            $ref: "#/components/schemas/CarInventory"
 *    responses:
 *      '201':
 *        description: Successful response
 *        content:
 *          application/json:
 *            example:
 *              message: Car added successfully,
 *              data:
 *                _id: "car_id"
 *                engineNo: EN09187
 *                chasisNo: CN09187
 *                make: Porsche
 *                modelName: "911"
 *                variant: GT3 RS
 *                price: 100000000
 *                registeredIn: Punjab
 *                registrationNo: VXR 1008
 *                modelYear: 2024
 *                mileage: 1009
 *                fuelType: Petrol
 *                transmissionType: Automatic
 *                taxHistory: Token/Tax Paid
 *                assembly: Local
 *                document:
 *                  - Original Book
 *                  - Fresh Import
 *                image: string
 *                isSold: false
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
 */
const createCar = async (req: Request, res: Response) => {
  try {
    const { chasisNo } = req.body;

    const existingData = await CarInventoryModel.findOne({ chasisNo });

    if (!existingData) {
      req.body.image = req.file?.filename;

      const data = await CarInventoryModel.create(req.body);
      res.status(201).json(success("Car added successfully", data));
    } else {
      return res.status(409).json(error("Car with Chasis No already exists"));
    }
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      const validationErrors = Object.values(err.errors).map(
        (err) => err.message
      );
      res.status(422).json(error("Validation Error", validationErrors));
    } else {
      if (err instanceof Error) {
        res
          .status(500)
          .json(error(err.message || "Some error occured while adding car. "));
      }
    }
  }
};

/**
 * Update Data
 * @swagger
 * /car-inventory/{id}:
 *  put:
 *    tags:
 *      - car inventory
 *    summary: Update car by ID
 *    description: Car can be updated using the specific ID with a request body
 *    operationId: updateCar
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: Car ID
 *        schema:
 *          type: string
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            $ref: "#/components/schemas/CarInventory"
 *    responses:
 *      '200':
 *        description: Success
 *        content:
 *          application/json:
 *            example:
 *              message: Car updated successfully
 *              data:
 *                _id: "car_id"
 *                engineNo: EN09187
 *                chasisNo: CN09187
 *                make: Porsche
 *                modelName: "911"
 *                variant: GT3 RS
 *                price: 100000000
 *                registeredIn: Punjab
 *                registrationNo: VXR 1008
 *                modelYear: 2024
 *                mileage: 1009
 *                fuelType: Petrol
 *                transmissionType: Automatic
 *                taxHistory: Token/Tax Paid
 *                assembly: Local
 *                document:
 *                  - Original Book
 *                  - Fresh Import
 *                image: string
 *                isSold: false
 *      '400':
 *        $ref: "#/components/responses/InvalidId"
 *      '404':
 *        $ref: "#/components/responses/NotFound"
 *      '422':
 *        $ref: "#/components/responses/InvalidInput"
 *      '500':
 *        $ref: "#/components/responses/InternalServer"
 */
const updateCar = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { chasisNo } = req.body;

    const existingData = await CarInventoryModel.findById(id);

    if (!existingData) {
      return res.status(404).json(error("Car not found"));
    }

    if (chasisNo !== existingData.chasisNo) {
      return res.status(400).json(error("Chasis No cannot be updated"));
    }

    req.body.image = req.file?.filename;
    const data = await CarInventoryModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (data) {
      return res.status(200).json(success("Car updated succeccfully", data));
    }
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
          .json(error(err.message || "Some error occured while updating car"));
      }
    }
  }
};

/**
 * Delete Data
 * @swagger
 * /car-inventory/{id}:
 *  delete:
 *    tags:
 *      - car inventory
 *    summary: Delete customer by ID
 *    description: Delete any customer by using its specific id
 *    operationId: deleteCar
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
 *      '400':
 *        $ref: "#/components/responses/InvalidId"
 *      '404':
 *        $ref: "#/components/responses/NotFound"
 *      '500':
 *        $ref: "#/components/responses/InternalServer"
 */
const deleteCar = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const data = await CarInventoryModel.findByIdAndDelete(id);

    if (!data) {
      return res.status(404).json(error("Car does not exist"));
    }

    return res.status(200).json(success("Car deleted successfully"));
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      res.status(400).json(error("Invalid ObjectId Format"));
    } else {
      if (err instanceof Error) {
        res
          .status(500)
          .json(error(err.message || "Some error occured while deleting car"));
      }
    }
  }
};

export default {
  getAllCar,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
};
