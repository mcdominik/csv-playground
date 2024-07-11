import { useState } from "react";
import Papa from "papaparse";
import { Table } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { message, Upload } from "antd";
import axios from "axios";
import { EnrichForm } from "./EnrichForm";

type Props = {
  data?: Papa.ParseResult<unknown>;
};

const CsvReader: React.FC<Props> = (props): JSX.Element => {
  const { Dragger } = Upload;
  const emptyFile = {
    data: [],
    errors: [],
    meta: {
      fields: [],
      delimiter: "",
      linebreak: "",
      aborted: false,
      truncated: false,
      cursor: 0,
    },
  };
  const [data, setData] = useState<Papa.ParseResult<unknown>>(
    props.data ?? emptyFile
  );
  const [fileName, setFileName] = useState<string>("");

  const uploadFile = async (data: unknown[], filename: string) => {
    const payload = {
      title: filename,
      content: JSON.stringify(data),
    };
    const response = await axios.post(`csv-files`, payload);
    return response.data;
  };

  const uploadProps: UploadProps = {
    name: "file",
    multiple: false,
    beforeUpload: (file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const csvData = e.target?.result;
        Papa.parse(csvData as string, {
          header: true,
          complete: async (result) => {
            await uploadFile(result.data, file.name);
            setData(result);
            setFileName(file.name);
            message.success(`${file.name} file uploaded successfully.`);
          },
          error: (error: any) => {
            message.error(`${file.name} file upload failed: ${error}`);
          },
        });
      };
      reader.readAsText(file);
      return false;
    },
    onDrop(e) {
      message.info(`Dropped files: ${e.dataTransfer.files}`);
    },
  };
  let newItems: any[] = [];
  const myColumns = data?.meta?.fields?.map((field: string) => ({
    title: field,
    dataIndex: field,
    key: field,
  }));

  data?.data.forEach((object: any) => {
    let newItem: any = {};
    myColumns?.forEach((column) => {
      newItem[column.key] = object[column.key];
    });
    newItems.push(newItem);
  });

  return (
    <>
      {data.meta.fields && data.data.length > 0 ? (
        <>
          <EnrichForm title={fileName} columns={data.meta.fields} />
          <Table pagination={false} dataSource={newItems} columns={myColumns} />
        </>
      ) : (
        <Dragger {...uploadProps} style={{ maxHeight: "300px" }}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
          <p className="ant-upload-hint">
            Support CSV files, up to size of 1GB.
          </p>
        </Dragger>
      )}
    </>
  );
};
export default CsvReader;
