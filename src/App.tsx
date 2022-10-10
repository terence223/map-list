import React, { useState } from 'react';
import { Chrono } from 'react-chrono';
import { Map } from 'react-map-gl';
import {
  Button,
  Col,
  DatePicker,
  Input,
  InputNumber,
  Modal,
  notification,
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
  max-width: 1400px;
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

type TypeEnum = 'businessTrip' | 'holiday' | 'other';

type FilterOptionType = {
  label: string;
  value: TypeEnum;
};

export type DataType = {
  location: string;
  type: string;
  description: string;
  startDate: moment.Moment;
  duration: number;
  position?: [number, number];
};

const MAPBOX_TOKEN =
  'pk.eyJ1IjoidGVyZW5jZTIyMyIsImEiOiJjbDkxOXVzd2QxOGgwM29ubnkxcTJkbm0wIn0.OHoi6LE2IHXYhig-nPAkDw';

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
  const [filter, setFilter] = useState<TypeEnum | undefined>();
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
          onChange={(val: TypeEnum | typeof ALL_WORD) => {
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
              fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${addingData.location}.json?access_token=${MAPBOX_TOKEN}`
              )
                .then(res => {
                  return res.json();
                })
                .then(res => {
                  if (res.features[0]?.center) {
                    const temp = [...data];
                    let targetIndex: number | undefined;

                    // array is sorted by time, find the right position to insert data
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

                    temp.splice(targetIndex, 0, {
                      ...addingData,
                      position: res.features[0].center,
                    });
                    setActiveIndex(targetIndex);
                    setData(temp);
                  } else {
                    notification.open({
                      message: 'No This Location',
                      description: 'There is no this location at Mapbox',
                    });
                  }
                })
                .catch(err => {
                  notification.open({
                    message: 'Error',
                    description: 'Something wrong',
                  });
                });
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
                      type: type as TypeEnum,
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
      <TimeLine datas={data} activeIndex={activeIndex} filter={filter} />
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
  filter: TypeEnum | undefined;
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
      position: data.position,
    };
  });

  const [mapRef, setMapRef] = useState();

  if (!items.length) {
    return null;
  }

  return (
    <ContentWrapper>
      <TimeLineWrapper>
        <Chrono
          key={items.length}
          //@ts-ignore
          items={items}
          mode="HORIZONTAL"
          style={{ maxWidth: '1400px', width: '80%', height: '500px' }}
          showAllCardsHorizontal
          activeItemIndex={activeIndex}
          onItemSelected={item => {
            // @ts-ignore
            mapRef?.flyTo({ center: item.position });
          }}
        />
      </TimeLineWrapper>
      <Map
        ref={e => {
          // @ts-ignore
          setMapRef(e);
        }}
        initialViewState={{
          longitude: -100,
          latitude: 40,
          zoom: 3.5,
        }}
        style={{ maxWidth: '1400px', width: '80%', height: '500px' }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxAccessToken={MAPBOX_TOKEN}
      />
    </ContentWrapper>
  );
};

export default App;
