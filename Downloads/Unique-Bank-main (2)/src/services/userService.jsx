import axios from "axios";
let baseUrl = "http://localhost:8999/";
let url = "http://localhost:8999/admin/all";
let notAdmin = "http://localhost:8999/admin/not/Admin";
let notManager = "http://localhost:8999/manager/not/Manager";
let onlyCustomer = "http://localhost:8999/employee/not/Employee";
let updateUrl = "http://localhost:8999/admin/update/manager";
let deleteUrl = "http://localhost:8999/admin/delete/manager";
let addManagerUrl = "http://localhost:8999/admin/add/manager";
let addEmployeeUrl = "http://localhost:8999/admin/add/employee";
let addCustomerUrl = "http://localhost:8999/admin/add/customer";
let getCustomerAccountByUserId = baseUrl+"account/get-customer-accounts/";
let adminUpdateEmployee=baseUrl+"admin/update/employee";
let adminDeleteEmployee=baseUrl+"admin/delete/employee/";
let adminUpdateCustomer=baseUrl+"admin/update/customer";
let adminDeleteCustomer=baseUrl+"admin/delete/customer/";
let managerAddEmployee = baseUrl + "manager/add/employee";
let managerUpdateEmployee = baseUrl + "manager/update/employee";
let managerDeleteEmployee = baseUrl + "manager/delete/employee/";
let managerAddCustomer = baseUrl + "manager/add/customer";
let managerUpdateCustomer = baseUrl + "manager/update/customer";
let managerDeleteCustomer = baseUrl + "manager/delete/customer/";
let employeedeleteCustomerUrl = baseUrl + "employee/delete/customer/";
let employeeupdateCustomerUrl = baseUrl + "employee/update/customer";
let employeeAddCustomer = baseUrl + "employee/add/customer";
let employeeGetAllAccounts = baseUrl + "account/get/all/accounts";
let employeeCreateAccount = baseUrl + "account/create-account";
let getTransaction = baseUrl + "transaction/get/all/transactions";
let employeeWithdrawAmount = baseUrl + "transaction/withdraw";
let employeeDepositAmount = baseUrl + "transaction/deposit";
let employeeTransferAmount = baseUrl + "transaction/transfer";
let employeeGetAllLoan = baseUrl + "api/v1/loan/get/all/loans";
let getGiftCard = baseUrl + "gift";
let getCreditCard = baseUrl + "api/credit-cards";
let getCreditCardByCardHolderName=getCreditCard+"/cardholdername/";
let applyCreditCards = baseUrl + "api/credit-cards/apply";
let getLocker = baseUrl + "lockers";
let payDueCustomer=getCreditCard+"/payment";
let assignLockers = baseUrl + "lockers/assign";
let createLockers= baseUrl+"lockers";
let loan = baseUrl + "api/v1/loan";
let onprocessLoan = loan + "/verify/";
let approveLoan = loan + "/approve/";
let rejectLoan = loan + "/reject/";
let disbureLoan = loan + "/disburse/";
let closeLoan = loan + "/close/";
let applyLoan=loan+"/apply";
let getCustomerByUsername=baseUrl+"users/get/user/";
let customerUpdateCustomer=baseUrl+"customer/update/customer";
let getCustomertransaction=baseUrl+"account/getAccountStatement/";
let getCustomerLoanByUserId=loan+"/getLoanByUserId/";
let getCustomerLockerByUserId=baseUrl+"lockers/user/";
let getCustomerassignLocker=baseUrl+"lockers/user/";
let getCustomerGiftCard=baseUrl+"gift/user/"
let getEmail=baseUrl+"sendemail";
let getUserByEmail=baseUrl+"users/get/user/email/";
let userUpdatePassword=baseUrl+"users/update/user";
export const addManager = (values, config) => {
  console.log(values, "user");
  return axios.post(addManagerUrl, values, config);
};
export const addEmployee = (values, config) => {
  return axios.post(addEmployeeUrl, values, config);
};
export const addCustomer = (values, config) => {
  console.log(values, "user");
  return axios.post(addCustomerUrl, values, config);
};
export const managerAddEmployees = (values, config) => {
  console.log(values, "user");
  return axios.post(managerAddEmployee, values, config);
};
export const managerAddCustomers = (values, config) => {
  console.log(values, "user");
  return axios.post(managerAddCustomer, values, config);
};
export const editUsers = (values, config) => {
  console.log(values, "user");
  return axios.post(updateUrl, values, config);
};
export const adminUpdateEmployees = (values, config) => {
  console.log(values, "user");
  return axios.post(adminUpdateEmployee, values, config);
};
export const adminUpdateCustomers = (values, config) => {
  console.log(values, "user");
  return axios.post(adminUpdateCustomer, values, config);
};

export const managerUpdateEmployees = (values, config) => {
  console.log(values, "user");
  return axios.post(managerUpdateEmployee, values, config);
};

export const managerUpdateCustomers = (values, config) => {
  console.log(values, "user");
  return axios.post(managerUpdateCustomer, values, config);
};
export const customerUpdateCustomers = (values, config) => {
  console.log(values, "user");
  return axios.post(customerUpdateCustomer, values, config);
};
export const getUsers = () => {
  return axios.get(notAdmin);
};

export const getAccounts = (config) => {
  return axios.get(employeeGetAllAccounts, config);
};

export const getNotManager = () => {
  return axios.get(notManager);
};
export const getNotEmoloyee = () => {
  return axios.get(onlyCustomer);
};
export const deleteUsers = (id, config) => {
  console.log(id, "id");
  console.log(config, "config");
  return axios.delete(deleteUrl +"/"+ id, config);
};

export const adminDeleteEmployees = (id, config) => {
  console.log(id, "id");
  console.log(config, "config");
  return axios.delete(adminDeleteEmployee + id, config);
};
export const adminDeleteCustomers = (id, config) => {
  console.log(id, "id");
  console.log(config, "config");
  return axios.delete(adminDeleteCustomer + id, config);
};

export const managerDeleteEmployees = (id, config) => {
  console.log(id, "id");
  console.log(config, "config");
  return axios.delete(managerDeleteEmployee + id, config);
};

export const managerDeleteCustomers = (id, config) => {
  console.log(id, "id");
  console.log(config, "config");
  return axios.delete(managerDeleteCustomer + id, config);
};

export const employeeAddCustomers = (values, config) => {
  console.log(values, "user");
  return axios.post(employeeAddCustomer, values, config);
};

export const employeeupdateCustomerUrls = (values, config) => {
  console.log(values, "user");
  return axios.post(employeeupdateCustomerUrl, values, config);
};

export const employeedeleteCustomerUrls = (id, config) => {
  console.log(id, "id");
  console.log(config, "config");
  return axios.delete(employeedeleteCustomerUrl + id, config);
};

export const createAccount = (values, config) => {
  return axios.post(employeeCreateAccount, values, config);
};

export const getTransactions = (config) => {
  return axios.get(getTransaction, config);
};

export const depositAmount = (values, config) => {
  return axios.post(employeeDepositAmount, values, config);
};

export const withdrawAmount = (values, config) => {
  return axios.post(employeeWithdrawAmount, values, config);
};

export const transferAmount = (values, config) => {
  return axios.post(employeeTransferAmount, values, config);
};

export const getLoan = (config) => {
  console.log("loanconfig", config);
  return axios.get(employeeGetAllLoan, config);
};
export const getGiftCards = (config) => {
  return axios.get(getGiftCard, config);
};
export const addGiftCard = (values, config) => {
  console.log(values, "user");
  console.log(config, "config");
  return axios.post(getGiftCard, values, config);
};

export const addBalanceGiftCard = (values, config) => {
  console.log(values, "values");
  console.log(typeof values.amount);
  console.log(config, "config");
  return axios.post(
    getGiftCard + "/" + values.cardnumber + "/balance",
    values,
    config
  );
};

export const getCreditCards = (config) => {
  return axios.get(getCreditCard, config);
};

export const applyCreditCard = (cardData, config) => {
  return axios.post(applyCreditCards, cardData, config);
};

export const setCreditLimit = (id, amount, config) => {
  console.log(id, amount, config, "hjcgjschjsagdjs");
  const data = {
    limit: amount,
  };
  return axios.post(baseUrl + `api/credit-cards/${id}/limit`, data, config);
};

export const getLockers = (config) => {
  return axios.get(getLocker, config);
};

export const assignLocker = (values, config) => {
  console.log(values, "values", config);
  return axios.post(assignLockers, values, config);
};

export const createLocker = (values, config) => {
  console.log(values, "values", config);
  return axios.post(createLockers, values, config);
};

export const releaseLocker = (values, config) => {
  console.log(values, "values", config);
  return axios.post(getLocker + "/" + values.id + "/release", values, config);
};

export const approveLoans = (values, config) => {
  console.log(values, "heeeeyyyyy", config);
  return axios.put(approveLoan + "/" + values.id, null, config);
};

export const closeLoans = (values, config) => {
  console.log(values, "values", config);
  return axios.put(closeLoan + values.id, null, config);
};

export const disburseLoans = (values, config) => {
  console.log(values, "values", config);
  return axios.put(disbureLoan + values.id, values, config);
};

export const onprocessLoans = (values, config) => {
  console.log(values, "values", config);
  return axios.put(onprocessLoan + values.id, null, config);
};

export const rejectLoans = (values, config) => {
  console.log(values, "values", config);
  return axios.put(rejectLoan + values.id, null, config);
};

export const emiCalculator = (values, config) => {
  console.log(values, "values", config);
  return axios.put(loan + "/emiCalculator", values, config);
};

export const applyLoans = (values, config) => {
  console.log(values, "values", config);
  return axios.post(applyLoan, values, config);
};


export const getUsersByUsername = (values, config) => {
  console.log(values, "values", config);
  return axios.get(getCustomerByUsername+values, null, config);
};

export const getCustomerAccountsByUserId = (userId, config) => {
  const url = `${getCustomerAccountByUserId}${userId}`;
  console.log(userId, "userId", config.headers);
  return axios.get(url, config);
};

export const getCustomerLockersByUserId = (userId, config) => {
  const url = `${getCustomerLockerByUserId}${userId}`;
  console.log(userId, "userId", config.headers);
  return axios.get(url, config);
};


export const getCustomerAccountsStatementByAccountId = (accountId, config) => {
  const url = `${getCustomertransaction}${accountId}`;
  console.log(accountId, "userId", config.headers);
  return axios.get(url, config);
};


export const getCustomerLoansByUserId = (userId, config) => {
  const url = `${getCustomerLoanByUserId}${userId}`;
  console.log(userId, "userId", config.headers);
  return axios.get(url, config);
};

export const getCustomerGiftCardsByUserId = (userId, config) => {
  const url = `${getCustomerGiftCard}${userId}`;
  console.log(userId, "userId", config.headers);
  return axios.get(url, config);
};

export const getCreditCardsByCardHolderName = (name, config) => {
  const url = `${getCreditCardByCardHolderName}${name}`;
  console.log(name, "name", config.headers);
  return axios.get(url, config);
};

export const payDue = (values, config) => {
  console.log(values, "values", config);
  const url=`${payDueCustomer}`
  return axios.post(url, values, config);
};

export const sendEmailToBank = (values, config) => {
  console.log(values, "values", config);
  const url=`${getEmail}`
  return axios.post(url, values, config);
};

export const getUsersFromEmail = (values) => {
  // console.log(values, "values", config);
  // const url=`${getUserByEmail}+values`
  return axios.get(getUserByEmail+values, null, null);
};

export const userUpdatePasswords = (values) => {
  // console.log(values, "values", config);
  const url=`${userUpdatePassword}`
  return axios.post(url, values, null);
};