import {
  Button,
  Flex,
  Form,
  Input,
  Modal,
  Radio,
  Typography,
  message,
} from "antd";
import axios from "axios";
import Papa from "papaparse";
import { useState } from "react";
import { EnrichDto } from "../dto/enrich.dto";

type Props = {
  columns: string[];
  title: string;
};

export const EnrichForm = (props: Props) => {
  const { Title } = Typography;

  const [open, setOpen] = useState(false);
  const [, setLoading] = useState(false);
  const [selectedCsvKey, setSelectedCsvKey] = useState(props.columns[0]);
  const [enrichColumns, setEnrichColumns] = useState<string[]>([]);
  const [selectedJsonKey, setSelectedJsonKey] = useState("");
  const [secondCsv, setSecondCsv] = useState<string>("");

  const handleLoad = async (values: any) => {
    const endpoint = values.endpoint;

    try {
      const response = await axios.get(endpoint);
      const csv = Papa.unparse(response.data);

      const csvJson = JSON.stringify(csv);
      setSecondCsv(csvJson);

      const firstRow = response.data[0];
      if (firstRow) {
        const columns = Object.keys(firstRow);
        setEnrichColumns(columns);
      }
    } catch (error) {
      message.error("Failed to load JSON data from the provided endpoint");
    }
  };

  const showModal = () => {
    setOpen(true);
  };

  // TO DO FIX UPROCESSABLE ENTITY ERROR

  const handleOk = async () => {
    setLoading(true);
    const payload: EnrichDto = {
      title: props.title,
      key_csv: selectedCsvKey,
      key_json: selectedJsonKey,
      json_string: secondCsv,
    };
    await axios.post("/csv-files/enrich-json", payload);

    setLoading(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleCsvCheckboxChange = (event: any) => {
    setSelectedCsvKey(event.target.value);
  };

  const handleJsonCheckboxChange = (event: any) => {
    setSelectedJsonKey(event.target.value);
  };

  return (
    <>
      <Flex gap={"8px"}>
        <Button
          type="primary"
          onClick={showModal}
          style={{ maxWidth: "auto" }}
          children={"Enrich data"}
        />
      </Flex>
      <Modal
        open={open}
        title="Enrich data"
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div>
          <Form layout="vertical" onFinish={handleLoad}>
            <Form.Item
              label="URL"
              name="endpoint"
              rules={[
                { required: true, message: "Please input the endpoint URL!" },
              ]}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              style={{ marginBottom: "40px" }}
            >
              <Input addonBefore="http" />
            </Form.Item>
            <Button type="primary" htmlType="submit">
              Load
            </Button>
          </Form>
          {enrichColumns.length > 0 && (
            <Radio.Group
              onChange={handleJsonCheckboxChange}
              value={selectedJsonKey}
            >
              {enrichColumns.map((item) => (
                <Radio key={item} value={item}>
                  {item}
                </Radio>
              ))}
            </Radio.Group>
          )}
        </div>
        <Title level={5}>Choose key column to join with</Title>
        <Flex style={{ width: "100%" }}>
          <Flex style={{ width: "100%" }} vertical gap={"8px"}>
            <Radio.Group
              onChange={handleCsvCheckboxChange}
              value={selectedCsvKey}
            >
              {props.columns.map((item) => (
                <Radio key={item} value={item}>
                  {item}
                </Radio>
              ))}
            </Radio.Group>
          </Flex>
        </Flex>
      </Modal>
    </>
  );
};
