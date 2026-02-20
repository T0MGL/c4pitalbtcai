# Instrucciones: Sincronización CRM ↔ Google Sheets

## ✅ Checklist Rápido

Antes de empezar, verifica que tu Google Sheet tenga:

- [ ] Encabezado **`id`** en la columna A (minúscula)
- [ ] Encabezado **`status`** en la columna I (minúscula)
- [ ] Al menos un lead con datos completos
- [ ] El nombre de tu hoja/pestaña (probablemente "Hoja 1")

---

## 📋 Paso 1: Actualizar el Google Apps Script

### 1.1 Abre tu Google Sheet de leads

Ve a tu Google Sheet donde están los leads.

### 1.2 Abre el Editor de Apps Script

1. En el menú superior, haz clic en: **Extensiones** > **Apps Script**
2. Se abrirá una nueva pestaña con el editor de código

### 1.3 Reemplaza el código

1. **Selecciona TODO** el código actual (Ctrl+A o Cmd+A)
2. **Bórralo**
3. Abre el archivo `google-apps-script.js` de tu proyecto
4. **Copia TODO** el código de ese archivo
5. **Pégalo** en el editor de Apps Script

### 1.4 Configura el nombre de tu hoja

En la línea 44 del código, verás:

```javascript
const SHEET_NAME = "Hoja 1";
```

⚠️ **IMPORTANTE**: Cambia `"Hoja 1"` por el nombre exacto de tu hoja/pestaña (mira la pestaña en la parte inferior de tu Google Sheet).

### 1.5 Guarda

1. Haz clic en el ícono de **guardar** (💾) o presiona Ctrl+S / Cmd+S
2. Pon un nombre al proyecto si te lo pide (ejemplo: "Capital BTC CRM Sync")

---

## 🚀 Paso 2: Implementar como Aplicación Web

### 2.1 Nueva Implementación

1. En el editor de Apps Script, haz clic en **Implementar** (arriba a la derecha)
2. Selecciona **Nueva implementación**

### 2.2 Configuración

1. **Tipo**: Selecciona **Aplicación web**
2. **Descripción**: "CRM Sync" (o lo que quieras)
3. **Ejecutar como**: **Yo** (tu cuenta)
4. **Quién tiene acceso**: **Cualquier persona**
5. Haz clic en **Implementar**

### 2.3 Autorización

Si es la primera vez:

1. Te pedirá **autorización**
2. Haz clic en **Autorizar acceso**
3. Selecciona tu cuenta de Google
4. Verás una advertencia de "App no verificada"
5. Haz clic en **Avanzado** > **Ir a [nombre del proyecto] (no seguro)**
6. Haz clic en **Permitir**

### 2.4 Copia la URL

1. Una vez implementado, verás una pantalla con **URL de la aplicación web**
2. **Copia toda la URL** (se verá así: `https://script.google.com/macros/s/ABC123.../exec`)
3. Guárdala, la necesitarás en el siguiente paso

---

## ⚙️ Paso 3: Configurar el Proyecto Local

### 3.1 Crea el archivo .env.local

En la raíz de tu proyecto (donde está `index.html`), crea un archivo llamado **`.env.local`**

### 3.2 Agrega la configuración

Pega este contenido (reemplazando la URL con la que copiaste):

```env
# CRM Access Password
CRM_PASSWORD=capitalbtcai@2026

# Google Apps Script URL
GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/TU_SCRIPT_ID_AQUI/exec
```

⚠️ Reemplaza `TU_SCRIPT_ID_AQUI` con tu URL completa copiada en el paso anterior.

### 3.3 Reinicia el servidor de desarrollo

1. Si tienes el servidor corriendo, deténlo (Ctrl+C)
2. Vuelve a iniciarlo:

```bash
npm run dev
```

---

## 🧪 Paso 4: Probar la Sincronización

### 4.1 Abre el CRM

1. Ve a: `http://localhost:5173/crm` (o tu puerto local)
2. Ingresa la contraseña: `capitalbtcai@2026`

### 4.2 Prueba cambiar un status

1. Busca un lead en la lista
2. Haz clic en el botón ✓ (checkmark) para marcarlo como "convertido"
3. **Abre la consola del navegador** (F12 > Consola)
4. Deberías ver logs como:
   ```
   [CRM] Enviando actualización a Google Sheets: {...}
   [CRM] Respuesta de Google Sheets: {...}
   [CRM] ✓ Status actualizado exitosamente en Google Sheets
   ```

### 4.3 Verifica en Google Sheets

1. Ve a tu Google Sheet
2. Busca el lead que actualizaste
3. La columna `status` debería haber cambiado a "converted"

---

## 🐛 Troubleshooting (Solución de Problemas)

### ❌ Error: "Hoja no encontrada"

**Causa**: El nombre de la hoja en el script no coincide con el nombre real.

**Solución**:
1. Ve a tu Google Sheet
2. Mira el nombre de la pestaña en la parte inferior (ejemplo: "Hoja 1")
3. Ve al Apps Script
4. Cambia la línea 44:
   ```javascript
   const SHEET_NAME = "TU_NOMBRE_EXACTO_AQUI";
   ```
5. Guarda y **vuelve a implementar** (Implementar > Administrar implementaciones > ⚙️ > Nueva versión)

---

### ❌ Error: "Columna 'id' no encontrada"

**Causa**: La columna A no tiene el encabezado "id" (o está mal escrito).

**Solución**:
1. Ve a tu Google Sheet
2. En la celda **A1**, escribe exactamente: **`id`** (todo en minúscula)
3. Guarda y prueba de nuevo

---

### ❌ Error: "Columna 'status' no encontrada"

**Causa**: La columna I no tiene el encabezado "status" (o está mal escrito).

**Solución**:
1. Ve a tu Google Sheet
2. En la celda **I1**, escribe exactamente: **`status`** (todo en minúscula)
3. Guarda y prueba de nuevo

---

### ❌ Error: "Lead con ID 'xxx' no encontrado"

**Causa**: El ID del lead en el CRM no coincide con el ID en Google Sheets.

**Solución**:
1. Abre la consola del navegador (F12)
2. Mira el log: `[CRM] Enviando actualización a Google Sheets:` y anota el ID
3. Ve a tu Google Sheet
4. Busca ese ID en la columna A
5. Si no existe, puede ser porque:
   - El lead es de prueba (mock data) que no existe en Sheets
   - Los IDs no se están generando correctamente

**Verificación adicional**:
1. En tu Google Sheet, ve a **Extensiones** > **Apps Script**
2. Haz clic en **Ejecuciones** (panel izquierdo)
3. Mira los logs de la última ejecución
4. Deberías ver logs detallados de lo que está pasando

---

### ❌ No pasa nada, no hay errores

**Causa**: El `GOOGLE_SCRIPT_URL` no está configurado o no se cargó.

**Solución**:
1. Verifica que el archivo `.env.local` existe en la raíz del proyecto
2. Verifica que la línea `GOOGLE_SCRIPT_URL=...` está correcta
3. Reinicia el servidor de desarrollo (Ctrl+C, luego `npm run dev`)
4. Limpia la caché del navegador (Ctrl+Shift+R)
5. En la consola del navegador, escribe: `console.log(import.meta.env.GOOGLE_SCRIPT_URL)`
   - Debería mostrar tu URL
   - Si muestra `undefined`, el .env.local no se está cargando

---

## 📊 Estructura Correcta del Google Sheet

Tu Google Sheet debe tener **exactamente** estos encabezados en la fila 1:

| A | B | C | D | E | F | G | H | I |
|---|---|---|---|---|---|---|---|---|
| **id** | Fecha | Nombre | WhatsApp | Email | Capital | Experiencia | Objetivo | **status** |

**Notas importantes**:
- **id** y **status** DEBEN estar en minúscula
- Los demás pueden estar capitalizados (Fecha, Nombre, etc.)
- El orden importa para nuevas inserciones, pero no para actualizaciones

---

## 🎯 Verificación Final

Si todo funciona correctamente:

✅ Al cambiar el status en el CRM, la consola del navegador muestra logs de éxito
✅ El Google Sheet se actualiza automáticamente (puede tomar 1-2 segundos)
✅ Al recargar el CRM, los cambios se mantienen (porque se leen desde Sheets)

---

## 📞 Soporte

Si después de seguir estos pasos aún tienes problemas:

1. Copia los logs de la consola del navegador
2. Copia los logs de Google Apps Script (Extensiones > Apps Script > Ejecuciones)
3. Toma una captura del encabezado de tu Google Sheet
4. Contacta al desarrollador con esta información

---

**Última actualización**: Febrero 2026
**Versión**: 2.0
