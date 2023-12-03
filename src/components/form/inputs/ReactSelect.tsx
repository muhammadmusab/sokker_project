import { useCallback, useRef } from 'react';
import { components, GroupBase, OptionsOrGroups, Props } from 'react-select';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import CreatableSelect from 'react-select/creatable';
import { IOption } from '../../../types/general';

import { useAsync } from '../../../hooks/useAsync';

import { Error } from '../../ui/Error';

export interface ReactSelectProps extends Props<IOption, boolean, GroupBase<IOption>> {
  name: string;
  isCreateable?: boolean;
}

export type AsyncProps = {
  isAsync?: true;
  callback: (query: string) => Promise<OptionsOrGroups<IOption, GroupBase<IOption>>>;
};
export type NormalSelectProps = {
  isAsync?: false;
};
export type AsyncSelectProps = ReactSelectProps & AsyncProps;
export type IReactSelectProps = ReactSelectProps & (AsyncProps | NormalSelectProps);

export const ReactSelectAsync = ({ callback, ...rest }: AsyncSelectProps) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { value, loading, error, callbackMemoized } = useAsync<
    OptionsOrGroups<IOption, GroupBase<IOption>> | undefined
  >(callback, []);

  const loadOptions = useCallback(
    async (query: string): Promise<OptionsOrGroups<IOption, GroupBase<IOption>>> => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      return new Promise((resolve) => {
        timeoutRef.current = setTimeout(() => {
          resolve(callback(query));
        }, 1000);
      });
    },
    [callbackMemoized],
  );

  return (
    <>
      <AsyncSelect
        isLoading={loading}
        defaultOptions={value ? value : false}
        loadOptions={loadOptions}
        {...rest}
      />
      {error ? <Error className="mt-1">{error}</Error> : null}
    </>
  );
};

export const ReactSelectInput = (props: IReactSelectProps) => {
  const { SingleValue, Option, MultiValue } = components;
  const IconSingleValue = (props) => (
    <SingleValue {...props}>
      {Boolean(props.data.image) && (
        <img
          src={props.data.image}
          style={{
            height: '30px',
            width: '30px',
            borderRadius: '50%',
            marginRight: '10px',
          }}
          alt={props.data.label}
        />
      )}
      {props.data.label}
    </SingleValue>
  );
  const IconMultiValue = (props) => (
    <MultiValue {...props}>
      {Boolean(props.data.image) && (
        <img
          src={props.data.image}
          style={{
            height: '30px',
            width: '30px',
            borderRadius: '50%',
            marginRight: '10px',
          }}
          alt={props.data.label}
        />
      )}
      {props.data.label}
    </MultiValue>
  );

  const IconOption = (props) => (
    <Option {...props}>
      {Boolean(props.data.image) && (
        <img
          src={props.data.image}
          style={{
            height: '30px',
            width: '30px',
            borderRadius: '50%',
            marginRight: '10px',
          }}
          alt={props.data.label}
        />
      )}
      {props.data.label}
    </Option>
  );

  let SelectControl = Select;

  if (props.isAsync) {
    console.log('running')
    SelectControl = ReactSelectAsync;
  }
  if (props.isCreateable) {
    SelectControl = CreatableSelect;
  }

  return (
    <SelectControl
      {...props}
      classNames={{
        input: () => '',
        control: () =>
          '',
        placeholder: () => '',
        singleValue: () => '',
        multiValue: () => '',
        multiValueLabel: () => '',
        option: () => '',
      }}
      components={{
        SingleValue: IconSingleValue,
        Option: IconOption,
        MultiValue: IconMultiValue,
      }}
    />
  );
};
