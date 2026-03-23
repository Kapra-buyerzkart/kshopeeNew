// import Employee from "../database/models/Employee";
// import Client from "../database/models/Client";
import { UserData } from "./dataType";

// types.ts
export type RootStackParamList = {
  Home: undefined;       // No params expected
  Main: undefined;       // No params expected
  OwnerLogin: undefined; // No params expected
  EmployeeLogin: undefined; // No params expected
  OwnerRegistration: undefined; // No params expected
  SelectUserScreen: undefined; // No params expected for SelectUserScreen
  Details: { data: string, dataOne: UserData[] }; // Params expected for Details screen
  CheckComponent: { data: string, dataOne: UserData[] };
  CheckApiScreen: undefined; // No params expected for CheckApiScreen
  OrderHistory: undefined;
  OrderDetails: undefined;
  TransactionSuccess: {
    amount: number;
    paymentMethod: 'Cash' | 'Card' | 'UPI';
    balance?: number;
  };
  // Clients: undefined;
  // ClientAdd: { client?: Client } | undefined;
  // Employees: undefined;
  // EmployeeDetails: { data: string, dataOne: any };
  // EmployeeAdd: { employee?: Employee } | undefined;
  Report: undefined;
  ManageStore: undefined;
  OrderReport: undefined;
  OrderTaking: undefined;
  Account: undefined;
  EditProfile: undefined;
  Support: undefined;
  StoreItemsList: undefined;
  AddStoreItem: { product?: string } | undefined;
  ProductDetails: { item?: any } | undefined;
};
