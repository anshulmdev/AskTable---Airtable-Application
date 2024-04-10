

export async function preparingData(view) {
  try {
    const queryResult = view.selectRecords();
    await queryResult.loadDataAsync();
    const viewMetadata = view.selectMetadata();
    await viewMetadata.loadDataAsync();

    const tableRecords = queryResult;
    const tableFields = viewMetadata.visibleFields;

    let fields = {};
    tableFields.forEach((field) => {
      fields[field.id] = { name: field.name, type: field.type };
    });

    let records = [];
    tableRecords.records.forEach((element) => {
      records.push(element._data.cellValuesByFieldId);
    });

    const csvRows = [];

    // Add field names as the header row
    const headerRow = Object.values(fields)
      .filter((field) => field.type !== 'multipleAttachments' && field.type !== 'longText')
      .map((field) => field.name)
      .join(',');
    csvRows.push(headerRow);

    records.forEach((record) => {
      let recordTemp = {};
      Object.keys(record).forEach((key) => {
        if (fields[key]) {
          if (fields[key].type === 'multipleAttachments') {
            // Exclude multipleAttachments field
            return;
          } else if (fields[key].type === 'longText') {
            // Exclude longText field
            return;
          } else if (fields[key].type === 'multipleCollaborators') {
            recordTemp[String(fields[key].name)] = record[key][0].email;
          } else if (fields[key].type === 'multipleSelects') {
            recordTemp[String(fields[key].name)] = record[key][0].name;
          } else if (fields[key].type === 'singleSelect') {
            recordTemp[String(fields[key].name)] = record[key].name;
          } else if (fields[key].type === 'barcode') {
            recordTemp[String(fields[key].name)] = record[key].text;
          } else {
            recordTemp[String(fields[key].name)] = record[key];
          }
        }
      });
      csvRows.push(Object.values(recordTemp).join(','));
    });

    const csvContent = csvRows.join('\n');

    return csvContent;
  } catch (error) {
    console.error('Error preparing data:', error);
    throw error;
  }
}