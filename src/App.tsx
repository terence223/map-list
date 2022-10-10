import React, { useState } from 'react';
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
} from 'antd';
import * as moment from 'moment';
import styled from 'styled-components';

import './App.css';

const { Option } = Select;

const MenuBar = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 14px 20px;
  border-bottom: 1px solid #eeeeee;
  width: 100%;
`;

const FormRow = styled(Row)`
  padding-right: 140px;
  padding-left: 60px;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const FormTitle = styled(Col)`
  text-align: right;
  line-height: 32px;
  padding-right: 10px;
`;

const RequiredMark = styled.span`
  color: #ff4d4f;
`;

type FilterOptionType = {
  label: string;
  value: string;
};

type DataType = {
  location: string;
  type: string;
  description: string;
  startDate?: moment.Moment;
  duration: number;
};

const FILTER_OPTIONS: FilterOptionType[] = [
  { label: 'business trip', value: 'businessTrip' },
  { label: 'holiday', value: 'holiday' },
  { label: 'other', value: 'other' },
];

const INITIAL_DATA: DataType = {
  location: '',
  type: FILTER_OPTIONS[0].value,
  description: '',
  duration: 1,
};

const ALL_WORD = 'all';

const App = () => {
  const [filter, setFilter] = useState<string>();
  const [isOpenAddDialog, setIsOpenAddDialog] = useState<boolean>(false);
  const [addingData, setAddingData] = useState<DataType>({ ...INITIAL_DATA });
  const [data, setData] = useState<DataType[]>([]);

  return (
    <div className="App">
      <MenuBar>
        <Select
          showSearch
          style={{ width: '200px' }}
          placeholder="Select type"
          optionFilterProp="children"
          onChange={(val: string) => {
            if (val === ALL_WORD) {
              setFilter(undefined);
            } else {
              setFilter(val);
            }
          }}
          filterOption={(input, option) =>
            (option!.children as unknown as string)
              .toLowerCase()
              .includes(input.toLowerCase())
          }
        >
          <Option key={ALL_WORD} value={ALL_WORD}>
            All
          </Option>
          {FILTER_OPTIONS.map((option: FilterOptionType) => {
            return (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            );
          })}
        </Select>
        <div>
          <Button
            type="primary"
            onClick={() => {
              setAddingData({ ...INITIAL_DATA });
              setIsOpenAddDialog(true);
            }}
          >
            Add Data
          </Button>
          <Modal
            title="Add Data"
            style={{ textAlign: 'left' }}
            centered
            open={isOpenAddDialog}
            onOk={() => {
              setIsOpenAddDialog(false);
              const temp = [...data];
              temp.push(addingData);
              setData(temp);
            }}
            onCancel={() => setIsOpenAddDialog(false)}
            width={1000}
          >
            <FormRow>
              <FormTitle span={3}>
                <RequiredMark>* </RequiredMark>
                Location:
              </FormTitle>
              <Col span={21}>
                <Input
                  value={addingData.location}
                  onChange={e => {
                    setAddingData({
                      ...addingData,
                      location: e.target.value as string,
                    });
                  }}
                />
              </Col>
            </FormRow>
            <FormRow>
              <FormTitle span={3}>
                <RequiredMark>* </RequiredMark>
                Type:
              </FormTitle>
              <Col span={21}>
                <Select
                  onChange={type => {
                    setAddingData({
                      ...addingData,
                      type: type as string,
                    });
                  }}
                  value={addingData.type}
                >
                  {FILTER_OPTIONS.map((option: FilterOptionType) => {
                    return (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    );
                  })}
                </Select>
              </Col>
            </FormRow>
            <FormRow>
              <FormTitle span={3}>Description:</FormTitle>
              <Col span={21}>
                <Input
                  value={addingData.description}
                  onChange={e => {
                    setAddingData({
                      ...addingData,
                      description: e.target.value as string,
                    });
                  }}
                />
              </Col>
            </FormRow>
            <FormRow>
              <FormTitle span={3}>
                <RequiredMark>* </RequiredMark>Start Date:
              </FormTitle>
              <Col span={21}>
                <DatePicker
                  value={addingData.startDate}
                  onChange={date => {
                    setAddingData({
                      ...addingData,
                      startDate: date as moment.Moment,
                    });
                  }}
                />
              </Col>
            </FormRow>
            <FormRow>
              <FormTitle span={3}>
                <RequiredMark>* </RequiredMark>Duration:
              </FormTitle>
              <Col span={21}>
                <InputNumber
                  min={1}
                  value={addingData.duration}
                  onChange={val => {
                    setAddingData({
                      ...addingData,
                      duration: val as number,
                    });
                  }}
                />
              </Col>
            </FormRow>
          </Modal>
        </div>
      </MenuBar>
    </div>
  );
};

export default App;
