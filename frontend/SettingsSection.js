// frontend/SettingsSection.js
import React, { useState, useEffect } from 'react';
import { globalConfig } from '@airtable/blocks';
import { Box, useBase, FormField, TablePicker, ViewPicker, Text, Icon } from '@airtable/blocks/ui';

export function SettingsSection({ setDialogMessage, setResponse, settingsSection, setSettingsSection }) {
  const base = useBase();
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    const fetchCredits = async () => {
      const user = globalConfig.get('airtableuserid');
      if (user && user.credits) {
        setCredits(user.credits);
      }
    };

    fetchCredits();

    const intervalId = setInterval(fetchCredits, 5000); // Update credits every 5 seconds

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <Box border="thick" borderStyle="dotted" borderColor="lightGray2" padding={3} margin={2}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center">
          <Icon name="grid1" marginRight={1} />
          <Text size="large" fontWeight="bold">Select Table and View</Text>
        </Box>
        <Text size="large" fontWeight="bold" textColor="black">
          Total Credits: {credits}
        </Text>
      </Box>
      <Text size="small" textColor="light" marginBottom={2}>Choose your data source</Text>
      <Box display="flex" alignItems="center" marginTop={2}>
        <FormField label="Table" style={{ marginRight: '1rem', flexBasis: '50%' }}>
          <TablePicker table={settingsSection.table} onChange={newTable => {
            setSettingsSection({ table: newTable, view: newTable.views[0] });
          }} />
        </FormField>
        <FormField label="View" style={{ marginRight: '1rem', flexBasis: '50%' }}>
          <ViewPicker table={settingsSection.table} view={settingsSection.view} onChange={newView => {
            setSettingsSection({ ...settingsSection, view: newView });
          }} />
        </FormField>
      </Box>
    </Box>
  );
}