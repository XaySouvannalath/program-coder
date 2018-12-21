export interface iResponses{
    success: boolean;
    data
}

export interface iMainTable{
    sucess: boolean;
    data: iTable;
}
export interface iMainColumn{
    success: boolean;
    data: iColumn;
}


export interface iTable{
    TABLE_NAME: string;
}

export interface iColumn{
    COLUMN_NAME: string
}