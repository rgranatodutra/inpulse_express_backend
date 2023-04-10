import { createCustomerController } from "./create.controller";
import { getAllCustomersController } from "./getAll.controller";
import { getOneCustomerByIdController } from "./getOneById.controller";
import { deleteCustomerController } from "./delete.controller";
import { recoverCustomerController } from "./recover.controller";
import { updateCustomerController } from "./update.controller";
import { getLastCustomerIdController } from "./getLastId.controller";

export const create = createCustomerController;
export const getAll = getAllCustomersController;
export const getOneById = getOneCustomerByIdController;
export const softDelete = deleteCustomerController;
export const recover = recoverCustomerController;
export const update = updateCustomerController;
export const getLastId = getLastCustomerIdController;