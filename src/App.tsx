import React, { useState } from 'react';
import { Chrono } from 'react-chrono';
import {
  Button,
  Col,
  DatePicker,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
} from 'antd';
import moment from 'moment';
import styled from 'styled-components';

import { defaultData } from './defaultData';

import './App.css';

const { Option } = Select;

const MenuBar = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 14px 20px;
  width: 100%;
  border-bottom: 1px solid #eeeeee;
`;

const FormRow = styled(Row)`
  margin-top: 20px;
  margin-bottom: 20px;
  padding-right: 140px;
  padding-left: 60px;
`;

const FormTitle = styled(Col)`
  padding-right: 10px;
  text-align: right;
  line-height: 32px;
`;

const TimeLineWrapper = styled.div`
  width: 80%;
  max-width: 1800px;
  height: 500px;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 60px;
  width: 100%;
`;

const RequiredMark = styled.span`
  color: #ff4d4f;
`;

type FilterOptionType = {
  label: string;
  value: string;
};

export type DataType = {
  location: string;
  type: string;
  description: string;
  startDate: moment.Moment;
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
  startDate: moment(),
  duration: 1,
};

const ALL_WORD = 'all';

const App = () => {
  const [filter, setFilter] = useState<string>();
  const [isOpenAddDialog, setIsOpenAddDialog] = useState<boolean>(false);
  const [addingData, setAddingData] = useState<DataType>({ ...INITIAL_DATA });
  const [data, setData] = useState<DataType[]>([...defaultData]);
  const [activeIndex, setActiveIndex] = useState<number>(0);

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
              let targetIndex: number | undefined;
              temp.forEach((ele, index) => {
                if (
                  targetIndex === undefined &&
                  !addingData.startDate.isAfter(ele.startDate)
                ) {
                  targetIndex = index;
                }
              });
              if (targetIndex === undefined) {
                targetIndex = temp.length;
              }
              temp.splice(targetIndex, 0, addingData);
              setActiveIndex(targetIndex);
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
      <ContentWrapper>
        <TimeLineWrapper>
          <TimeLine datas={data} activeIndex={activeIndex} filter={filter} />
        </TimeLineWrapper>
      </ContentWrapper>
    </div>
  );
};

const TimeLine = ({
  datas,
  activeIndex = 0,
  filter,
}: {
  datas: DataType[];
  activeIndex: number;
  filter: string | undefined;
}) => {
  const afterFilter = datas.filter(data => {
    if (!filter) {
      return true;
    }
    return data.type === filter;
  });
  const items = afterFilter.map(data => {
    return {
      title: data.startDate.format('YYYY MMM DD'),
      cardTitle: `${data.location} (${data.type})`,
      cardSubtitle: `Duration: ${data.duration}`,
      cardDetailedText: data.description,
    };
  });

  return (
    <Chrono
      key={items.length}
      items={items}
      mode="HORIZONTAL"
      showAllCardsHorizontal
      activeItemIndex={activeIndex}
    />
  );
};

export default App;
