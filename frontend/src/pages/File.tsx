import { useEffect, useState } from "react";
import Papa from "papaparse";
import axios from "axios";
import { message, Spin } from "antd";
import { useParams } from "react-router-dom";
import CsvReader from "../components/CsvReader";

export const File = () => {
  const { fileName } = useParams<{ fileName: string }>();
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFileByName = async () => {
      try {
        const response = await axios.get(`csv-files?title=${fileName}`);
        const jsonParsed = JSON.parse(response.data.content);
        const csvParsed = Papa.unparse(jsonParsed);
        const parsedData = Papa.parse(csvParsed, {
          header: true,
          skipEmptyLines: true,
        });

        setData(parsedData);

        return response.data;
      } catch (e) {
        message.error(`Failed to fetch file: ${e}`);
      } finally {
        setLoading(false);
      }
    };
    fetchFileByName();
  }, [fileName]);

  return <>{loading ? <Spin /> : <CsvReader data={data} />}</>;
};
