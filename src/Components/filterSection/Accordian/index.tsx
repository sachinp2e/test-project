import React from 'react';
import { Accordion, Form } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '@/Lib/hooks';
import { GlobalSearchType, setGlobalSearchFilter } from '@/Lib/globalSearchAndFilters/globalSearchAndFilters.slice';
import { getGlobalSearchDataSelector } from '@/Lib/globalSearchAndFilters/globalSearchAndFilters.selector';

type RadioLabels = {
  id: number;
  label: string;
  key: keyof GlobalSearchType;
  value: string;
}

interface AccordionItem {
  title: React.ReactNode;
  eventKey: string | number;
  radioLabels: RadioLabels[];
}

interface GenericAccordionProps {
  items: AccordionItem[];
}

const GenericAccordion: React.FC<GenericAccordionProps> = ({ items }) => {
  const dispatch = useAppDispatch();
  const data = useAppSelector(getGlobalSearchDataSelector);

  const onRadioClick = (radio: RadioLabels, eventKey: string | number) => () => {
    if (eventKey.toString() === '2' && radio.value === 'all') {
      dispatch(setGlobalSearchFilter({
        featured: false,
        expiringSoon: false,
        upcoming: false,
      }));
    } else if (eventKey.toString() === '2') {
      dispatch(setGlobalSearchFilter({
        featured: radio.value === 'featured',
        expiringSoon: radio.value === 'expiringSoon',
        upcoming: radio.value === 'upcoming',
      }));
    } else {
      dispatch(setGlobalSearchFilter({ [radio.key]: radio.value }));
    }
  };

  const isChecked = (radio: RadioLabels, eventKey: string | number): boolean => {
    if (eventKey.toString() === '2') {
      if (radio.value === 'all') {
        return !data.featured && !data.expiringSoon && !data.upcoming;
      }
      return !!data[radio.key];
    }
    return data[radio.key] === radio.value;
  };

  return (
    <Accordion defaultActiveKey={['0']} alwaysOpen>
      {items.map((item, itemIndex) => (
        <Accordion.Item key={item.eventKey} eventKey={(item.eventKey || '').toString()}>
          <Accordion.Header>{item.title}</Accordion.Header>
          <Accordion.Body>
            <Form>
              {item.radioLabels.map((radio, index) => {
                return (
                  <Form.Check
                    key={radio.id}
                    type="radio"
                    label={radio.label}
                    name={`radioGroup_${item.eventKey}`}
                    id={`radio_${item.eventKey}_${index}`}
                    defaultChecked={index === 0}
                    onClick={onRadioClick(radio, item.eventKey)}
                    checked={isChecked(radio, item.eventKey)}
                  />
                );
              })
              }
            </Form>
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
};

export default GenericAccordion;
