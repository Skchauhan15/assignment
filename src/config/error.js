class ERROR_MESSAGES {
    static UNAUTHORIZED = {
      status_code: 400,
      type: "UNAUTHORIZED",
      error_message: "You are not authorized to perform this action.",
    };
  
    static EMAIL_ALREADY_EXISTS = {
      status_code: 400,
      type: "EMAIL ALREADY EXISTS",
      error_message: "Sorry this email already exists",
    };
  
    static PHONE_ALREADY_EXISTS = {
      status_code: 400,
      type: "PHONE NUMBER ALREADY EXISTS",
      error_message: "Sorry this phone number already exists",
    };
  
    static INVALID_OBJECT_ID = {
      status_code: 400,
      type: "INVALID OBJECT ID",
      error_message: "Sorry this is not a valid object _id.",
    };
  
    static INVALID_PASSWORD = {
      status_code: 400,
      type: "INVALID PASSWORD",
      error_message: "Sorry you entered a wrong password. Please try again",
    };
  
    static EMAIL_NOT_FOUND = {
      status_code: 400,
      type: "EMAIL NOT FOUND",
      error_message:
        "Sorry this email address is not registered with us. Please try again",
    };
  
    static SOMETHING_WENT_WRONG = {
      status_code: 400,
      type: "SOMETHING WENT WRONG",
      error_message: "Something went wrong. Please try again",
    };
  
    static ALREADY_SUBSCRIBED = {
      status_code: 400,
      type: "ALREADY SUBSCRIBED",
      error_message: "Plan already subscribed",
    };
  
    static ACCOUNT_BLOCKED = {
      status_code: 400,
      type: "ACCOUNT BLOCKED",
      error_message: "Sorry this account is temporary blocked.",
    };
  
    static ACCOUNT_DELETED = {
      status_code: 400,
      type: "ACCOUNT DELETED",
      error_message: "Sorry this account is temporary deleted.",
    };
  
    static ACCOUNT_DEACTIVATED = {
      status_code: 400,
      type: "ACCOUNT DEACTIVATED",
      error_message: "Sorry this account is temporary deactivated.",
    };
  
    static EMAIL_NOT_REGISTERED = {
      status_code: 400,
      type: "EMAIL NOT REGISTERED",
      error_message: "The email address provided is not registered with us",
    };
  
    static USER_NOT_FOUND = {
      status_code: 400,
      type: "USER NOT FOUND",
      error_message: "User not found!!",
    };
  
    static WRONG_OTP = {
      status_code: 400,
      type: "WRONG OTP",
      error_message: "Wrong OTP",
    };
  
    static OLD_PASSWORD_MISMATCH = {
      status_code: 400,
      type: "OLD PASSWORD MISMATCH",
      error_message: "Old password mismatch",
    };
  
    static PASSWORD_MATCHED = {
      status_code: 400,
      type: "PASSWORD SHOULD NOT BE SAME",
      error_message: "Password should not be same",
    };
  
    static PHONE_NUMBER_NOT_REGISTERED = {
      status_code: 400,
      type: "PHONE NUMBER NOT REGISTERED",
      error_message: "Phone number not registered",
    };
  
    static SIGNUP_BY_GOOGLE = {
      status_code: 400,
      type: "SIGNUP BY GOOGLE",
      error_message:
        "You are already sign up with this email by google. Please try to login with google now",
    };
  
    static SIGNUP_BY_FACEBOOK = {
      status_code: 400,
      type: "SIGNUP BY FACEBOOK",
      error_message:
        "You are already sign up with this email by facebook. Please try to login with facebook now",
    };
  
    static SIGNUP_BY_APPLE = {
      status_code: 400,
      type: "SIGNUP BY APPLE",
      error_message:
        "You are already sign up with this email by apple. Please try to login with apple now",
    };
  
    static ALREADY_EXIST = {
      status_code: 400,
      type: "ALREADY EXIST",
      error_message: "Name already exists",
    };
  
    static ALREADY_ADDED = {
      status_code: 400,
      type: "ALREADY ADDED",
      error_message: "Property already added to favourites",
    };
  
    static OWNER_CANNOT_MAKE_REQUEST = {
      status_code: 400,
      type: "OWNER CANNOT MAKE REQUEST",
      error_message: "Owner cannot make request for own property",
    };
  
    static ALREADY_REQUESTED = {
      status_code: 400,
      type: "ALREADY REQUESTED",
      error_message: "You already make request for this property",
    };
  
    static CHECK_PERMISSIONS = {
      status_code: 400,
      type: "CHECK PERMISSIONS",
      error_message: "You don't have permission to change this",
    };
  
    static ALREADY_REVIEWED = {
      status_code: 400,
      type: "ALREADY REVIEWED",
      error_message: "You already review this property",
    };
  
    static ALREADY_REPORTED_A_PROBLEM = {
      status_code: 400,
      type: "ALREADY REPORTED A PROBLEM",
      error_message: "You already reported this review",
    };
  
    static OWNER_CANNOT_REVIEW_OWN_PROPERTY = {
      status_code: 400,
      type: "OWNER CANNOT REVIEW OWN PROPERTY",
      error_message: "You cannot review own property",
    };
  
    static PROPERTY_ALREADY_REMOVED = {
      status_code: 400,
      type: "PROPERTY ALREADY REMOVED",
      error_message: "Property already removed",
    };
  
    static NOT_FOUND = {
      status_code: 400,
      type: "NOT FOUND",
      error_message: "Not found.",
    };
  
    static PRODUCT_ALREADY_EXIST = {
      status_code: 400,
      type: "PRODUCT ALREADY EXIST",
      error_message: "Product already exists",
    };
  
    static PLAN_ALREADY_EXIST = {
      status_code: 400,
      type: "PLAN ALREADY EXIST",
      error_message: "Plan already exists",
    };
  
    static ALREADY_REPORTED = {
      status_code: 400,
      type: "ALREADY REPORTED",
      error_message: "You already reported!",
    };
  }
  
module.exports = ERROR_MESSAGES;