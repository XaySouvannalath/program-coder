CREATE OR REPLACE PROCEDURE "PC_PRODUCT_TYPE_UPDATE"(
	P_ID TBL_PRODUCT_TYPE.ID%TYPE,
	P_PRODUCT_TYPE_NAME TBL_PRODUCT_TYPE.PRODUCT_TYPE_NAME%TYPE,
	P_PRODUCT_TYPE_DESC TBL_PRODUCT_TYPE.PRODUCT_TYPE_DESC%TYPE,
	P_RECORD_STAT TBL_PRODUCT_TYPE.RECORD_STAT%TYPE,
	P_USER_ID TBL_PRODUCT_TYPE.CLOSE_USER_ID%TYPE,P_ROW OUT NUMBER
) AS
	V_CLOSE_DATE DATE := NULL;
	V_CLOSE_USER_ID VARCHAR2(50) := NULL;
	
BEGIN
	IF P_RECORD_STAT = 'C' THEN
		V_CLOSE_DATE := SYSDATE;
		V_CLOSE_USER_ID := P_USER_ID;
	END IF;

	UPDATE TBL_PRODUCT_TYPE SET 

        PRODUCT_TYPE_NAME=P_PRODUCT_TYPE_NAME,
        PRODUCT_TYPE_DESC=P_PRODUCT_TYPE_DESC,
        RECORD_STAT=P_RECORD_STAT,
        CLOSE_DATE=V_CLOSE_DATE,
        CLOSE_USER_ID=V_CLOSE_USER_ID 
        WHERE ID=P_ID;


	P_ROW := SQL%ROWCOUNT;
END PC_PRODUCT_TYPE_UPDATE;