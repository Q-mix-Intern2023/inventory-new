import {
  Button,
  Card,
  Col,
  Input,
  Modal,
  Popconfirm,
  Row,
  Segmented,
  Space,
  Spin,
  Table,
  message,
} from "antd";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { API_URL, authUser } from "../../constanst";
import { CloudDownloadOutlined, DeleteOutlined, FormOutlined, PlusOutlined } from "@ant-design/icons";

import { Excel } from "antd-table-saveas-excel";


import StockEdit from "./Edit";
import StockAdd from "./add";

import StockAddText from "./addtext";
import Addot from "./addot";
import Addottext from "./addottext";
import SignIn from "../../containers/SignIn";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

const Stock = (props) => {
  const [data, setData] = useState([]);
  const [arrt1, setArrt1] = useState("");
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("Barcode");
  const [value2, setValue2] = useState("Barcode");

  const [dataModal, setDataModal] = useState([]);

  const [sortedInfo, setSortedInfo] = useState({});
  const [filteredInfo, setFilteredInfo] = useState({});
  const [searchedText, setSearchedText] = useState("");
  // const [searchedColumn, setSearchedColumn] = useState("");

  const tableLoading = {
    spinning: loading,
    indicator: <Spin type="loading" />,
  };

  const handleChange = (pagination, filters, sorter) => {
    console.log("Various parameters", pagination, filters, sorter);
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  const columns = [
    {
      title: "หมายเลขอะไหล่",
      dataIndex: "code",
      key: "code",
      width: 200,

      filteredValue: [searchedText],
      onFilter: (value, record) => {
        return (
          String(record.code).toLowerCase().includes(value.toLowerCase()) ||
          String(record.name).toLowerCase().includes(value.toLowerCase()) ||
          String(record.detail).toLowerCase().includes(value.toLowerCase()) ||
          String(record.parts).toLowerCase().includes(value.toLowerCase()) ||
          String(record.unit).toLowerCase().includes(value.toLowerCase()) ||
          String(record.status).toLowerCase().includes(value.toLowerCase()) ||
          String(record.createBy).toLowerCase().includes(value.toLowerCase()) ||
          String(record.storeName).toLowerCase().includes(value.toLowerCase())
        );
      },
      render: (text, record) => (
        <Link to={`/stock/detail/${record.id}`}>{record.code}</Link>
      ),
    },
    {
      title: "ชื่ออะไหล่",
      dataIndex: "name",
      key: "name",
      width: 150,
    },
    {
      title: "Store",
      dataIndex: "storeName",
      key: "storeName",
      filters: arrt1,
      filteredValue: filteredInfo.storeName||[props.match.params.store],
      onFilter: (value, record) => record.storeName.includes(value),
      sorter: (a, b) => a.storeName.length - b.storeName.length,
      sortOrder: sortedInfo.columnKey === "storeName" ? sortedInfo.order : null,
      ellipsis: true,
      width: 150,
    },
    {
      title: "รายละเอียด",
      dataIndex: "detail",
      key: "detail",
      width: 300,
    },
    {
      title: "Parts",
      dataIndex: "parts",
      key: "parts",
      width: 100,
    },
    {
      title: "จำนวน",
      dataIndex: "count",
      key: "count",
      width: 100,
    },
    {
      title: "หน่วยนับ",
      dataIndex: "unit",
      key: "unit",
      width: 100,
    },
    // {
    //   title: "สถานะ",
    //   dataIndex: "status",
    //   key: "status",
    //   width: 100,
    // },
    {
      title: "ผู้อัปเดต",
      dataIndex: "createBy",
      key: "createBy",
      width: 150,
    },

    {
      title: "Action",
      key: "action",
      width: 150,
      render: (text, record) => (
        <div>
          {/* <Button
            style={{ color: "#286efb" }}
            icon={<FormOutlined />}
            type="link"
            onClick={() => showModal1(record)}
          ></Button> */}

          <Popconfirm
            title={`คุณต้องการลบ "${record.name}" ออกจากคลังเก็บใช่หรือไม่?`}
            okText="Yes"
            cancelText="No"
            onConfirm={() => {
              axios
                .get(API_URL + "/api/Stock/Remove/" + record.id)
                .then((res) => {
                  console.log("delete category", res);
                  getDataTable();
                  message.success(`Delete ${record.name} Successfully!`);
                });
            }}
          >
            <Button
              style={{ color: "#FF4141", textAlign: "right" }}
              icon={<DeleteOutlined />}
              type="link"
            ></Button>
          </Popconfirm>
        </div>
      ),
    },
  ];
  const columnsExport = [
    {
      title: "หมายเลขอะไหล่",
      dataIndex: "code",
      key: "code",
      width: 200,
    },
    {
      title: "ชื่ออะไหล่",
      dataIndex: "name",
      key: "name",
      width: 150,
    },
    {
      title: "Store",
      dataIndex: "storeName",
      key: "storeName",
    },
    {
      title: "รายละเอียด",
      dataIndex: "detail",
      key: "detail",
    },
    {
      title: "Parts",
      dataIndex: "parts",
      key: "parts",
    },
    {
      title: "จำนวน",
      dataIndex: "count",
      key: "count",
    },
    {
      title: "หน่วยนับ",
      dataIndex: "unit",
      key: "unit",
    },
    {
      title: "ผู้อัปเดต",
      dataIndex: "createBy",
      key: "createBy",
    },
  ];
  const getDataTable = () => {
    setLoading(true);
    axios
      .get(API_URL + "/api/Stock/GetStock/" + authUser.user.id)
      .then((res) => {
        console.log("AAAAA", res);
        setArrt1(res.data.store);
        setData(res.data.data);
        setLoading(false);
      });
  };

  const showModal = () => {
    setOpen(true);
  };
  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 3000);
  };
  const handleCancel = () => {
    getDataTable();
    setOpen(false);
  };

  const showModal1 = (record) => {
    setDataModal(record);
    setOpen1(true);
  };
  const handleOk1 = () => {
    setTimeout(() => {
      setOpen1(false);
    }, 3000);
  };
  const handleCancel1 = () => {
    getDataTable();
    setOpen1(false);
  };

  const showModal2 = (record) => {
    setDataModal(record);
    setOpen2(true);
  };
  const handleOk2 = () => {
    setTimeout(() => {
      setOpen2(false);
    }, 3000);
  };
  const handleCancel2 = () => {
    getDataTable();
    setOpen2(false);
  };
  useEffect(() => {
    if (!authUser) {
      return <SignIn />;
    }
    // alert("SSS")
    getDataTable();
  }, []);

  const exportToExcel = () => {
    const excel = new Excel();
    excel
      .addSheet(`รายการอะไหล่`)
      .addColumns(columnsExport)
      .addDataSource(data, {
        str2Percent: true
      })
      .saveAs(`รายการอะไหล่.xlsx`);
  };
  return (
    <>
      <Row>
        <Col xl={24} lg={24} md={24} sm={24} xs={24}>
          <Card
            style={{ verticalAlign: "middle" }}
            title="อะไหล่รับเข้าศูนย์"
            extra={
              <div>
                <Button
                  type="primary"
                  style={{ marginTop: "10px" }}
                  onClick={showModal}
                  icon={<PlusOutlined />}
                >
                  <span>เพิ่มข้อมูล</span>
                </Button>
                <Button
                  type="primary"
                  style={{ marginTop: "10px" }}
                  onClick={showModal2}
                  icon={<PlusOutlined />}
                >
                  <span>เพิ่มอะไหล่จากแหล่งอื่น</span>
                </Button>
                <Button
                  type="primary"
                  style={{ marginTop: "10px" }}
                  onClick={exportToExcel}
                  icon={<CloudDownloadOutlined />}
                >
                  <span>Export</span>
                </Button>
              </div>
            }
          >
            <Input.Search
              placeholder="Search"
              onSearch={(value) => {
                setSearchedText(value);
              }}
              onChange={(e) => {
                setSearchedText(e.target.value);
              }}
            />
            <Table
              loading={tableLoading}
              className="gx-table-responsive"
              onChange={handleChange}
              columns={columns}
              dataSource={data}
              pagination={{ pageSize: 50 }}
              scroll={{ y: 500 }}
            />
          </Card>
        </Col>
      </Row>
      <Modal
        open={open}
        title="รับอะไหล่เข้าศูนย์"
        onOk={handleOk}
        onCancel={handleCancel}
        // width={1000}
        footer={null}
      >
        <Segmented
          options={["Barcode", "กรอกหมายเลข"]}
          value={value}
          onChange={setValue}
          style={{ marginBottom: "10px" }}
        />
        <div>{value === "Barcode" ? <StockAdd /> : <StockAddText />}</div>
      </Modal>
      <Modal
        open={open2}
        title="รับอะไหล่เข้าศูนย์จากแหล่งอื่น"
        onOk={handleOk2}
        onCancel={handleCancel2}
        // width={1000}
        footer={null}
      >
        <Segmented
          options={["Barcode", "กรอกหมายเลข"]}
          value={value2}
          onChange={setValue2}
          style={{ marginBottom: "10px" }}
        />
        <div>{value2 === "Barcode" ? <Addot /> : <Addottext />}</div>
      </Modal>
      <Modal
        open={open1}
        title="แบบฟอร์มแก้ไขข้อมูล"
        onOk={handleOk1}
        onCancel={handleCancel1}
        // width={1000}
        footer={null}
      >
        <StockEdit data={dataModal} />
      </Modal>
    </>
  );
};

export default Stock;
