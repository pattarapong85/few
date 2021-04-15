import { firestore } from 'firebase/app';
import Timestamp = firestore.Timestamp;

export class OrderHeader {
    ORDER_NO :  string;  
    ORDER_DATE :  Timestamp;  
    
    
    ORDER_STEP :  number;  
    STATUS :  string;
    STATUS_NAME :  string;

    STATUS_PAID :  boolean;
     
    PRODUCT_QTY :  number;  
      
    EMP_NO :  string;  

    SKILL_NO :  string; 
    SKILL_NAME :  string; 

    CHANNEL_NO :  string;  
    CHANNEL_NAME :  string; 
    CHANNEL_TYPE :  string;   
    WAREHOUSE_NAME : string;

   
    NAME_SOCIAL :  string;  
    EMAIL :  string;  
    
    CUS_NAME :  string;  
    CUS_ADDRESS :  string;  
    CUS_DISTRICT :  string;  
    CUS_AMPHURE :  string;  
    CUS_PROVINCE :  string;  
    CUS_ZIPCODE :  string;  
    CUS_FULL_ADDRESS : string;
    CUS_TEL1 :  string;  
    CUS_TEL2 :  string; 
    
    BILL_NAME :  string;
    BILL_ADDRESS :  string;  
    BILL_DISTRICT :  string;  
    BILL_AMPHURE :  string;  
    BILL_PROVINCE :  string;  
    BILL_ZIPCODE :  string;  
    BILL_FULL_ADDRESS : string;
    BILL_TEL1 :  string;  
    BILL_TEL2 :  string; 

    CUS_ADDRESS_SEND : string;
    BILL_ADDRESS_SEND : string;

    SHIPPING_COST :  number; 
     
    TYPE_DISCOUNT :  string;
    DISCOUNT_AMOUNT : number;
    DISCOUNT_PERCENT : number;

    TOTAL_DC : number;
    TOTAL_ORDER : number;  
    TOTAL_COMMISSION : number; 
    TOTAL_PAY : number; 

    TYPE_TAX : string;
    TAX : number;
    VAT :  number;
    COD : number;
    //FEE : number;
    TANSPORT_RATE_NO :  string;
    TANSPORT_RATE_NAME :  string;    
    TRANSPORT_NO :  string;  
    TRANSPORT_NAME :  string; 
    TRACKING_NO :  string; 
    TRANSPORT_DATE :  Timestamp;
    // TANSPORT_COD_NO :  string;  
    // TANSPORT_COD_NAME :  string; 
    //   
    // BANK_CODE :  string;
    // BANK_NAME :  string;

    STATUS_TRANFER_NO : string;
    STATUS_TRANFER_NAME : string;

    REMARK :  string;  
    PRE_ORDER :  boolean;  
    // FLAG_TRANSFER :  boolean;
    FLAG_COD :  boolean;
    ACTIVE_FLAG : string;

    BILL_FLAG  : boolean;

    CONFIRM_SUBMIT : boolean;
    CONFIRM_SUBMIT_BY : string;
    CONFIRM_SUBMIT_DATE : Timestamp; 

    CONFIRM_ORDER_STATUS : boolean;
    CONFIRM_ORDER_BY : string;
    CONFIRM_ORDER_DATE : Timestamp; 

    CONFIRM_PAY_STATUS : boolean;
    CONFIRM_PAY_BY : string;
    CONFIRM_PAY_DATE : Timestamp;
    
    PACK_STATUS : boolean;
    PACK_BY : string;
    PACK_DATE : Timestamp; 

    SEND_STATUS : boolean;
    SEND_BY : string;
    SEND_DATE : Timestamp; 

    COMPLETE_STATUS : boolean;
    COMPLETE_BY : string;
    RECEIVE_DATE :  Timestamp; 
    COMPLETE_DATE : Timestamp; 

    RETURN_STATUS : boolean;
    RETURN_BY : string;
    RETURN_DATE : Timestamp; 

    REORDER_STATUS : boolean;
    REORDER_BY : string;
    REORDER_DATE : Timestamp; 

    // TARNSFER_DATE :  Timestamp  
    // TARNSPORT_DATE :  Timestamp
    // ATTACFILE_NAME :  string;
    // SLIP_URL :  string; 
    // ATTACFILE_URL  :  string;  
    // REF_TRANFER  :  string;  
    // REMARK_TRANFER  :  string;
    // ACCOUNT_NO  :  string;  
    // AMOUNT_TRANFER:  number; 

    CREATE_DATE :  Timestamp;  
    CREATE_BY :  string;  
    UPDATE_DATE :  Timestamp;  
    UPDATE_BY :  string;  
    HEAD_CD : string;
    PROJECT : string;

    ORDER_DETAILS : any [];
    STOCK_REF_ID : any [];
    TRANSPORT_REF_ID : any [];
    PAY_REF_ID : any [];
}
