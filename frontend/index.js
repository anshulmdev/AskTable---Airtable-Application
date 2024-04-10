import {initializeBlock} from '@airtable/blocks/ui';
import React, { useState, useEffect } from 'react';
import { Box, useBase, Loader } from '@airtable/blocks/ui';
import { SettingsSection } from './SettingsSection';
import { ChatSection } from './ChatSection';
import { ResponseSection } from './ResponseSection';
import { Dialog } from './Dialog';
import { fetchOrCreateUser } from '../controllers/userController';

function HelloWorldApp() {
  const base = useBase();
  const [settingsSection, setSettingsSection] = useState({ table: base.tables[0], view: base.tables[0].views[0] });
  const [loading, setLoading] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [response, setResponse] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUserData() {
      const userData = await fetchOrCreateUser(base, setDialogMessage);
      setUser(userData);
    }
  
    fetchUserData();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <Box>
      <SettingsSection setDialogMessage={setDialogMessage} setResponse={setResponse} settingsSection={settingsSection} setSettingsSection={setSettingsSection} />
      <ChatSection setDialogMessage={setDialogMessage} setResponse={setResponse} settingsSection={settingsSection} />
      <ResponseSection response={response} />
      {dialogMessage && (
        <Dialog
          message={dialogMessage.message}
          type={dialogMessage.type}
          onClose={() => setDialogMessage('')}
        />
      )}
    </Box>
  );
}

initializeBlock(() => <HelloWorldApp />);