import React, { useEffect, useState } from "react";
import { Flex, Layout, Menu, Typography } from "antd";
import axios from "axios";
import { CsvFile } from "../models/csv-file";
import { Outlet, useNavigate } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";

export const AppOutlet: React.FC = () => {
  const { Sider } = Layout;
  const { Title } = Typography;
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<CsvFile[]>([]);
  const navigate = useNavigate();

  const items =
    history?.map((file, index) => ({
      key: String(index + 1),
      label: file.title,
    })) ?? [];

  const handleMenuClick = (e: any) => {
    const item = items.find((item) => item.key === e.key);
    if (item) {
      const route = history.find((file) => file.title === item.label);
      if (route) {
        navigate(`/files/${route.title}`);
      }
    }
  };

  const fetchHistory = async (): Promise<CsvFile[]> => {
    const response = await axios.get(`csv-files`);
    console.log(response.data);
    return response.data;
  };

  useEffect(() => {
    async function updateHistory() {
      const history = await fetchHistory();
      setHistory(history);
      console.log("History updated:", history);
    }
    updateHistory();
  }, []);

  return (
    <>
      <Layout style={{ height: "100vh", overflow: "hidden" }} hasSider>
        <Sider
          style={{
            overflow: "auto",
            height: "100vh",
            position: "fixed",
            top: 0,
            bottom: 0,
            left: 0,
            paddingLeft: "1rem",
          }}
        >
          <div className="demo-logo-vertical" />
          <Title style={{ color: "white" }} level={3}>
            Files
          </Title>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={["4"]}
            items={items}
            onClick={handleMenuClick}
          />
          <Flex onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
            <Title style={{ color: "white", fontSize: "small" }} level={5}>
              Upload more
            </Title>
            <PlusOutlined style={{ color: "white" }} />
          </Flex>
        </Sider>
        <Layout
          style={{
            marginLeft: 200,
            overflow: "hidden",
            padding: "16px",
            gap: "16px",
          }}
        >
          <Outlet />
        </Layout>
      </Layout>
    </>
  );
};
