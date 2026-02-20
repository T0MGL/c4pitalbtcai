/**
 * CAPITAL BTC AI - Google Apps Script (Versión Optimizada)
 *
 * INSTRUCCIONES DE INSTALACIÓN:
 *
 * 1. Abre tu Google Sheet de leads
 * 2. Ve a Extensiones > Apps Script
 * 3. Reemplaza TODO el código con este
 * 4. IMPORTANTE: Cambia SHEET_NAME abajo por el nombre de tu hoja (ejemplo: "Hoja 1")
 * 5. Guarda (Ctrl+S o Cmd+S)
 * 6. Haz clic en "Implementar" > "Nueva implementación" (o "Administrar implementaciones" si ya existe)
 * 7. Tipo: "Aplicación web"
 * 8. Ejecutar como: "Yo"
 * 9. Quién tiene acceso: "Cualquier persona"
 * 10. Haz clic en "Implementar"
 * 11. Autoriza los permisos cuando te lo pida
 * 12. Copia la URL que aparece
 * 13. En tu proyecto, crea/edita el archivo .env.local y agrega:
 *     GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/TU_SCRIPT_ID/exec
 *
 * ESTRUCTURA DEL GOOGLE SHEET:
 * Tu hoja DEBE tener estos encabezados en la fila 1 (EXACTAMENTE como se muestra):
 *
 * | id | Fecha | Nombre | WhatsApp | Email | Capital | Experiencia | Objetivo | status |
 *
 * IMPORTANTE:
 * - "id" en minúscula (columna A)
 * - "status" en minúscula (columna I)
 * - Los demás pueden estar capitalizados
 */

// === CONFIGURACIÓN ===
const SHEET_NAME = "Hoja 1"; // ⚠️ CAMBIA ESTO al nombre exacto de tu hoja/pestaña

/**
 * Helper para crear respuesta JSON con headers CORS correctos
 */
function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * doGet - Maneja peticiones GET (leer todos los leads)
 */
function doGet(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);

    if (!sheet) {
      Logger.log(`ERROR: Hoja "${SHEET_NAME}" no encontrada`);
      return jsonResponse({ error: `Hoja "${SHEET_NAME}" no encontrada. Verifica SHEET_NAME en el script.` });
    }

    const data = sheet.getDataRange().getValues();

    if (data.length <= 1) {
      // Solo hay encabezados, no hay leads
      return jsonResponse([]);
    }

    const headers = data[0];
    const rows = data.slice(1);

    // Convierte cada fila a un objeto con los encabezados como keys
    const result = rows
      .filter(row => row.some(cell => cell !== '')) // Filtra filas completamente vacías
      .map(row => {
        const obj = {};
        headers.forEach((header, i) => {
          obj[header] = row[i];
        });
        return obj;
      });

    Logger.log(`GET: Devolviendo ${result.length} leads`);

    return jsonResponse(result);

  } catch (error) {
    Logger.log(`ERROR en doGet: ${error.message}`);
    return jsonResponse({ error: error.message, stack: error.stack });
  }
}

/**
 * doPost - Maneja peticiones POST (crear o actualizar leads)
 */
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);

    if (!sheet) {
      Logger.log(`ERROR: Hoja "${SHEET_NAME}" no encontrada`);
      return jsonResponse({ success: false, error: `Hoja "${SHEET_NAME}" no encontrada. Verifica SHEET_NAME en el script.` });
    }

    // Parsea el JSON recibido (funciona con y sin Content-Type: application/json)
    const payload = JSON.parse(e.postData.contents);
    const action = payload.action;

    Logger.log(`POST recibido: action=${action}, payload=${JSON.stringify(payload)}`);

    // ACCIÓN: Crear nuevo lead
    if (action === 'create') {
      return handleCreate(sheet, payload);
    }

    // ACCIÓN: Actualizar lead existente
    if (action === 'update') {
      return handleUpdate(sheet, payload);
    }

    Logger.log(`ERROR: Acción desconocida: ${action}`);
    return jsonResponse({ success: false, error: `Acción no reconocida: ${action}` });

  } catch (error) {
    Logger.log(`ERROR en doPost: ${error.message}\n${error.stack}`);
    return jsonResponse({ success: false, error: error.message, stack: error.stack });
  }
}

/**
 * Maneja la creación de un nuevo lead
 */
function handleCreate(sheet, payload) {
  try {
    const newRow = [
      payload.id || Utilities.getUuid(),
      payload.date ? new Date(payload.date).toLocaleString('es-CO', { timeZone: 'America/Bogota' }) : new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' }),
      payload.name || '',
      payload.phone || '',
      payload.email || '',
      payload.capital || '',
      payload.experience || '',
      payload.goal || '',
      payload.status || 'new'
    ];

    sheet.appendRow(newRow);

    Logger.log(`CREATE exitoso: Lead agregado con ID ${newRow[0]}`);

    return jsonResponse({ success: true, action: 'create', id: newRow[0] });

  } catch (error) {
    Logger.log(`ERROR en handleCreate: ${error.message}`);
    return jsonResponse({ success: false, error: error.message });
  }
}

/**
 * Maneja la actualización de un lead existente
 */
function handleUpdate(sheet, payload) {
  try {
    const id = payload.id;
    const field = payload.field;
    const value = payload.value;

    Logger.log(`UPDATE: Buscando lead con id="${id}" para actualizar campo "${field}" a "${value}"`);

    const data = sheet.getDataRange().getValues();
    const headers = data[0];

    // Busca las columnas necesarias (case-insensitive)
    const idCol = findColumnIndex(headers, 'id');
    const fieldCol = findColumnIndex(headers, field);

    Logger.log(`Columnas encontradas: idCol=${idCol}, fieldCol=${fieldCol}`);
    Logger.log(`Headers: ${JSON.stringify(headers)}`);

    if (idCol === -1) {
      Logger.log('ERROR: Columna "id" no encontrada');
      return jsonResponse({ success: false, error: 'Columna "id" no encontrada. Verifica que la primera fila tenga un encabezado "id" (minúscula)' });
    }

    if (fieldCol === -1) {
      Logger.log(`ERROR: Columna "${field}" no encontrada`);
      return jsonResponse({ success: false, error: `Columna "${field}" no encontrada. Verifica que la primera fila tenga un encabezado "${field}"` });
    }

    // Busca la fila con el ID especificado
    for (let i = 1; i < data.length; i++) {
      const rowId = String(data[i][idCol]).trim();
      const searchId = String(id).trim();

      Logger.log(`Comparando: rowId="${rowId}" vs searchId="${searchId}"`);

      if (rowId === searchId) {
        // Encontró el lead, actualiza el campo
        const rowNumber = i + 1;
        const colNumber = fieldCol + 1;

        Logger.log(`Lead encontrado en fila ${rowNumber}. Actualizando celda (${rowNumber}, ${colNumber}) a "${value}"`);

        sheet.getRange(rowNumber, colNumber).setValue(value);

        Logger.log(`UPDATE exitoso: Lead ${id} actualizado`);

        return jsonResponse({ success: true, action: 'update', id: id, field: field, value: value, row: rowNumber, col: colNumber });
      }
    }

    // No se encontró el ID
    Logger.log(`ERROR: ID "${id}" no encontrado en la hoja`);
    return jsonResponse({ success: false, error: `Lead con ID "${id}" no encontrado en la hoja` });

  } catch (error) {
    Logger.log(`ERROR en handleUpdate: ${error.message}\n${error.stack}`);
    return jsonResponse({ success: false, error: error.message, stack: error.stack });
  }
}

/**
 * Busca el índice de una columna por nombre (case-insensitive)
 */
function findColumnIndex(headers, columnName) {
  const searchName = columnName.toLowerCase().trim();

  for (let i = 0; i < headers.length; i++) {
    if (String(headers[i]).toLowerCase().trim() === searchName) {
      return i;
    }
  }

  return -1;
}
