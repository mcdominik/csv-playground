import { Layout, Typography } from "antd";
import CsvReader from "../components/CsvReader";

export const Home = () => {
  const { Content } = Layout;
  const { Title } = Typography;

  return (
    <>
      <Title>CSV Playground</Title>
      <Content style={{ overflow: "scroll" }}>
        <CsvReader />
      </Content>
    </>
  );
};
