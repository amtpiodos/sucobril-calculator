'use strict'

import { app, protocol, BrowserWindow, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import knex from 'knex'
const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}






ipcMain.on('sample', (event, args) => {
  let result = knex.select('lastname').from('Buyer')
  result.then(function(rows) {
    console.log('lastname', rows)
  })
})

// FUNCTION TO ADD NEW LOT ONLY BUYER IN DB
ipcMain.on('addLotOnlyBuyer', (event, data) => {
  const { buyer, payment_details, unit } = data
  console.log({buyer}, {payment_details}, {unit})
  const knex = getDbConnection()
  knex.insert({
      last_name: buyer.last_name,
      first_name: buyer.first_name,
      middle_initial: buyer.middle_initial,
      contact_number: buyer.contact_number,
      email_address: buyer.email_address,
      home_address: buyer.home_address,
      lot_id: unit.lot_id,
      realty: unit.realty_name,
      agent: unit.agent_name,
      status: 1
    })
    .returning('id')
    .into('Buyer')
    .then((id) => {
      console.log('INSERTED', id)
      const buyer_id = id
      const knex2 = getDbConnection()
      knex2.insert({
        buyer_id: buyer_id,
        total_contract_price: payment_details.total_contract_price,
        installment_months: payment_details.installment_months,
        monthly_installment: payment_details.monthly_installment,
        reservation_fee: payment_details.reservation_fee,
        reservation_type: payment_details.reservation_type,
        spot_downpayment: payment_details.spot_downpayment,
        new_tcp_less_downpayment: payment_details.new_tcp_less_downpayment,
        spot_cash_discount_percentage: payment_details.spot_cash_discount_percentage,
        spot_cash_discount_amount: payment_details.spot_cash_discount_amount,
        new_tcp_less_discount: payment_details.new_tcp_less_discount,
        monthly_start_date: payment_details.monthly_start_date,
        monthly_end_date: payment_details.monthly_end_date

      })
      .into('lot_payment')
      .then(() => {
        const knex3 = getDbConnection()
        knex3('Lot').where({ id: unit.lot_id  })
        .update({
          'status': 1,
          'owner_id': buyer_id
        }).then(() => {
          console.log('LOT STATUS UPDATED', unit.lot_id)
        }).catch((err) => { console.log('ADDING OF PAYMENT ERROR', err) ; throw err
        }).finally(() => knex3.destroy())
      // edit to only one lot updated (where statement)
      }).catch((err) => { console.log('LOT STATUS UPDATE ERROR', err) ; throw err
      }).finally(() => knex2.destroy())
      // event.reply('isBuyerAdded', 1)
  }).catch((err) => { console.log('INSERT ERROR', err) ; throw err
  }).finally(() => knex.destroy())
})

// FUNCTION TO FETCH ALL BUYERS FOR BUYERS LIST
ipcMain.on('fetchAllBuyers', (event, data) => {
  const knex = getDbConnection()
  knex.from('Buyer').select('id', 'last_name', 'first_name', 'middle_initial').then((buyers) => {
    event.reply('fetchedAllBuyers', buyers)
  }).catch((err) => { console.log('FETCH BUYERS LIST ERROR', err) ; throw err
  }).finally(() => knex.destroy())
})

// FUNCTION TO FETCH ALL PROJECTS
ipcMain.on('fetchProjectsList', (event, data) => {
  console.log('Fetching Projects')
  const knex = getDbConnection()
  knex('Project').select().then((projects) => {
    event.reply('fetchedProjectsList', projects)
  }).catch((err) => { console.log('FETCH PROJECTS LIST ERROR', err) ; throw err
  }).finally(() => knex.destroy())
})

// FUNCTION TO FETCH ALL PHASES
ipcMain.on('fetchPhasesList', (event, data) => {
  console.log('Fetching all PHASES under Project ID', data)
  const knex = getDbConnection()
  knex('Phase').where({ project_id: data }).then((phases) => {
    event.reply('fetchedPhasesList', phases)
  }).catch((err) => { console.log('FETCH PHASES LIST ERROR', err) ; throw err
  }).finally(() => knex.destroy())
})

// FUNCTION TO FETCH ALL BLOCKS
ipcMain.on('fetchBlocksList', (event, data) => {
  console.log('Fetching all BLOCKS under Project ID', data)
  const { id, has_phase } = data
  const knex = getDbConnection()
  if(has_phase) {
    knex('Block').where({ phase_id: id }).then((blocks) => {
      event.reply('fetchedBlocksList', blocks)
    }).catch((err) => { console.log('FETCH BLOCKS LIST ERROR', err) ; throw err
    }).finally(() => knex.destroy())
  } else {
    knex('Block').where({ project_id: data.id }).then((blocks) => {
      event.reply('fetchedBlocksList', blocks)
    }).catch((err) => { console.log('FETCH BLOCKS LIST ERROR', err) ; throw err
    }).finally(() => knex.destroy())
  }
})

// FUNCTION TO FETCH ALL LOTS
ipcMain.on('fetchLotsList', (event, data) => {
  console.log('Fetching all LOTS under Block ID', data)
  const knex = getDbConnection()
  knex('Lot').where({ block_id: data }).then((lots) => {
    event.reply('fetchedLotsList', lots)
  }).catch((err) => { console.log('FETCH LOTS LIST ERROR', err) ; throw err
  }).finally(() => knex.destroy())
})

// FUNCTION TO FETCH ALL BUYERS
ipcMain.on('fetchBuyersList', (event, data) => {
  const knex = getDbConnection()
  knex('Buyer').select().then((buyers) => {
    event.reply('fetchedBuyersList', buyers)
  }).catch((err) => { console.log('FETCH BUYERS LIST ERROR', err) ; throw err
  }).finally(() => knex.destroy())
})

// FUNCTION TO FETCH A SPECIFIC PROJECT
ipcMain.on('fetchProject', (event, data) => {
  console.log('Fetching project name', data)
  const knex = getDbConnection()
  knex('Project').where({ id: data }).then((project) => {
    if(project[0]) {
      console.log("FETCHING PROJECT", project[0])
      event.reply('fetchedProject', project[0])
    } else {
      console.log(`The project with id ${data} does not exist`)
    }
  }).catch((err) => { console.log('FETCH PROJECT NAME ERROR', err) ; throw err
  }).finally(() => knex.destroy())
})

// FUNCTION TO FETCH A SPECIFIC PHASE
ipcMain.on('fetchPhase', (event, data) => {
  console.log('Fetching PHASE', data)
  const knex = getDbConnection()
  knex('Phase').where({ id: data }).then((phase) => {
    if(phase[0]) {
      console.log("FETCHING PHASE", phase[0])
      event.reply('fetchedPhase', phase[0])
    } else {
      console.log("FETCHING PHASE", phase[0])
    }
  }).catch((err) => { console.log('FETCH PHASE NAME ERROR', err) ; throw err
  }).finally(() => knex.destroy())
})

// FUNCTION TO FETCH A SPECIFIC BLOCK
ipcMain.on('fetchBlock', (event, data) => {
  console.log('Fetching BLOCK', data)
  const knex = getDbConnection()
  knex('Block').where({ id: data }).then((block) => {
    if(block[0]) {
      console.log("FETCHING BLOCK", block[0])
      event.reply('fetchedBlock', block[0])
    } else {
      console.log("FETCHING BLOCK", block[0])
    }
  }).catch((err) => { console.log('FETCH BLOCK NAME ERROR', err) ; throw err
  }).finally(() => knex.destroy())
})

// FUNCTION TO FETCH A SPECIFIC LOT
ipcMain.on('fetchLot', (event, data) => {
  console.log('Fetching LOT', data)
  const knex = getDbConnection()
  knex('Lot').where({ id: data }).then((lot) => {
    if(lot[0]) {
      console.log('FETCHING LOT', lot[0])
      event.reply('fetchedLot', lot[0])
    } else {
      console.log("FETCHING LOT", lot[0])
    }
  }).catch((err) => { console.log('FETCH LOT NAME ERROR', err) ; throw err
  }).finally(() => knex.destroy())
})

// FUNCTION TO FETCH A SPECIFIC BUYER
ipcMain.on('fetchBuyer', (event, data) => {
  console.log('Fetching buyer id', data)
  const knex = getDbConnection()
  knex('Buyer').where({ id: data }).then((buyer) => {
    if(buyer[0]) {
      console.log("FETCHING BUYER", buyer[0])
      event.reply('fetchedBuyer', buyer[0])
    } else {
      console.log(`The buyer with id ${data} does not exist`)
      event.reply(`The buyer with id ${data} does not exist`)
    }
  }).catch((err) => { console.log('FETCH BUYER NAME ERROR', err) ; throw err
  }).finally(() => knex.destroy())
})

// FUNCTION TO FETCH PROJECT TYPE ( House & Lot / Lot Only )
ipcMain.on('fetchProjectType', (event, data) => {
  const knex = getDbConnection()
  knex('project_types')
    .where({ id: data })
    .then((type) => {
      if(type[0]) {
        console.log('FETCHING PROJECT TYPE', type[0])
        event.reply('fetchedProjectType', type[0])
      } else {
        console.log(`Project Type with id ${data} does not exist`)
        event.reply('fetchedProjectType', `Project Type with id ${data} does not exist`)
      }
    }).catch((err) => { console.log('FETCH PROJECT TYPE ERROR', err) ; throw err
  }).finally(() => knex.destroy())
})

// FUNCTION TO FOREFEIT BUYER AND REOPEN LOT
ipcMain.on('forefeitBuyer', (event, data) => {
  const { id, lot_id } = data
  const knex = getDbConnection()
  knex('Buyer')
    .where({ id: id  })
    .update({
      'status': 0
    }).then(() => {
      console.log('BUYER STATUS UPDATED: Buyer now INACTIVE', id)
      // Reopen lot, clear owner id
      const knex2 = getDbConnection()
      knex2('Lot')
        .where({ id: lot_id })
        .update({
          'status': 0,
          'owner_id': null,
          'reopened': 1
        }).then(() => {
          console.log(`LOT ${lot_id} IS NOW REOPENED`)
        }).catch((err) => { console.log('UPDATING LOT AFTER FOREFEITING BUYER ERROR', err) ; throw err
        }).finally(() => knex2.destroy())
    }).catch((err) => { console.log('FOREFEITING OF BUYER ERROR', err) ; throw err
    }).finally(() => knex2.destroy())
})


// FUNCTION TO CONNECT DB mysql
function getDbConnection() {
  const knex = require('knex')({
    client: 'mysql',
    connection: {
      host: '127.0.0.1',
      user: 'root',
      password: '',
      database: 'tumabini_db'
    }
  })

  return knex
}