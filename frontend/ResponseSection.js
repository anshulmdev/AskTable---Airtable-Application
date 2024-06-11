import React from 'react';
import { Box, Text, Icon, Link } from '@airtable/blocks/ui';

export function ResponseSection({ response }) {
  return (
    <Box border="thick" borderStyle="dotted" borderColor="lightGray2" padding={3} margin={2}>
      <Box display="flex" alignItems="center">
        <Icon name="chat" marginRight={2} />
        <Text size="large" fontWeight="bold">Response</Text>
      </Box>
      <Box backgroundColor="lightGray1" padding={3} borderRadius="large" marginTop={2}>
        <Text size="large">{response}</Text>
      </Box>
      <Box display="flex" alignItems="center" marginTop={2}>
        <Text size="small" textColor="light">
          Please note that we do not share certain data types like attachments or long text to focus on more useful and mathematical data for insights. We also do not store any information on our servers.
          For more credits: please reach out us at:
          <Link href="mailto:info@apilabz.com" target="_blank" flexGrow={1}>
          info@apilabz.com
        </Link>
        </Text>
      </Box>
    </Box>
  );
}