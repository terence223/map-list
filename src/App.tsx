import React, { useState } from 'react';
import { Select } from 'antd';
import styled from 'styled-components';

import './App.css';

const { Option } = Select;

const MenuBar = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 14px 20px;
  width: 100%;
`;

type FilterOptionType = {
  label: string;
  value: string;
};

const FILTER_OPTIONS: FilterOptionType[] = [
  { label: 'business trip', value: 'businessTrip' },
  { label: 'holiday', value: 'holiday' },
  { label: 'other', value: 'other' },
];

const ALL_WORD = 'all';

const App = () => {
  const [filter, setFilter] = useState<string>();

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
      </MenuBar>
    </div>
  );
};

export default App;
