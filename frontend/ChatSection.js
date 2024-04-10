import React, { useState } from 'react';
import { Box, Input, Button, Text, Icon } from '@airtable/blocks/ui';
import { askClaude } from '../controllers/claudeApi';
import { preparingData } from '../controllers/preparingData';

export function ChatSection({ setDialogMessage, setResponse, settingsSection }) {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    try {
      const csvContent = await preparingData(settingsSection.view);
      const response = await askClaude(`${question}    ${csvContent}`);
      setResponse(response.content[0].text);
    } catch (error) {
      if (error.message === 'Insufficient credits') {
        setDialogMessage({ message: 'You have insufficient credits. Please contact support for more credits.', type: 'warning' });
      } else {
        setDialogMessage({ message: 'Error getting answer: ' + error.message, type: 'error' });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box border="thick" borderStyle="dotted" borderColor="lightGray2" padding={3} margin={2}>
      <Box display="flex" alignItems="center">
        <Icon name="help" marginRight={2} />
        <Text size="large" fontWeight="bold">Ask a Question</Text>
      </Box>
      <Text size="small" textColor="light" marginBottom={2}>Enter your query below</Text>
      <Box display="flex" alignItems="center" marginTop={2}>
        <Input
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder="Type your question here..."
          flexGrow={1}
          marginRight={2}
        />
        <Button
          onClick={handleSubmit}
          disabled={loading}
          variant="primary"
          icon="share"
        >
          {loading ? 'Submitting...' : 'Submit'}
        </Button>
      </Box>
    </Box>
  );
}