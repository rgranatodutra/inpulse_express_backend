import { Request, Response } from "express";
import services from "../../services";
import { Customer } from "../../entities/customer";

export const deleteCustomerController = async (req: Request, res: Response) => {
    const customer = await services.customers.softDelete(req.findCustomer, req.body.motivo, req.user.data);

    return res.status(200).json(customer);
}