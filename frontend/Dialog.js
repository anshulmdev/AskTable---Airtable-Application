import React, { useState } from 'react';
import { Dialog as AirtableDialog, Text, Input, Button, Link, Box } from '@airtable/blocks/ui';

import { globalConfig } from '@airtable/blocks';

export function Dialog({ message, type, onClose, onSubmit, onReset }) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = () => {
    onSubmit(inputValue);
  };

  return (
    <AirtableDialog onClose={onClose} width="400px">
      <AirtableDialog.CloseButton />
      <Text variant="paragraph" marginBottom={3} textColor={getTextColor(type)}>
        {message}
      </Text>
      {onSubmit && (
        <Input
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder="Enter API key"
          marginBottom={3}
        />
      )}
     <Box display="flex" justifyContent="space-between" marginBottom={2}>
        <Button onClick={onSubmit ? handleSubmit : onClose} variant="primary" flexGrow={1} marginRight={1}>
          {onSubmit ? 'Submit' : 'Close'}
        </Button>
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Link href="mailto:info@apilabz.com" target="_blank" flexGrow={1}>
          <Button variant="default" icon="envelope" style={{ width: '100%' }}>
            Email Us
          </Button>
        </Link>
      </Box>
    </AirtableDialog>
  );
}

function getTextColor(type) {
  switch (type) {
    case 'error':
      return 'warning';
    case 'warning':
      return 'info';
    case 'success':
      return 'check';
    default:
      return 'info';
  }
}