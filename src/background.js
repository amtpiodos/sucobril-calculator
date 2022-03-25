'use strict'

// const { app, protocol, BrowserWindow, ipcMain } = require("electron")
// // const { createProtocol } = require('vue-cli-plugin-electron-builder/lib')
// // const installExtension = require('electron-devtools-installer')
// // const { VUEJS_DEVTOOLS } = require('electron-devtools-installer')
// const knex = require('knex')

import { app, protocol, BrowserWindow, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import { knex } from 'knex'


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
    // alert('not in dev mode')
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
    // win.loadURL('../public/index.html');
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
      project_id: unit.project_id,
      realty: unit.realty_name,
      agent: unit.agent_name,
      agent_number: unit.agent_number,
      status: 1,
      reservation_type: payment_details.reservation_type
    })
    .returning('id')
    .into('Buyer')
    .then((id) => {
      console.log('INSERTED', id)
      const buyer_id = id
      const knex2 = getDbConnection()
      knex2.insert({
        buyer_id: buyer_id,
        date: payment_details.date,
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
          'owner_id': buyer_id,
          'price_per_sqm': unit.price_per_sqm,
          'lot_area': unit.lot_area,
          'lot_type': unit.lot_type
        }).then(() => {
          // ADD SUCCESS
          event.reply('addedLotOnlyBuyer', {response: 1, new_id: buyer_id})
          console.log('LOT STATUS UPDATED', unit.lot_id)
        }).catch((err) => {
          // ADD FAIL
          event.reply('addedLotOnlyBuyer', {response: 0})
          console.log('ADDING OF PAYMENT ERROR', err) ; throw err
        }).finally(() => knex3.destroy())
      // edit to only one lot updated (where statement)
      }).catch((err) => {
        event.reply('addedLotOnlyBuyer', {response: 0})
        console.log('LOT STATUS UPDATE ERROR', err) ; throw err
      }).finally(() => knex2.destroy())
      // event.reply('isBuyerAdded', 1)
  }).catch((err) => {
    event.reply('addedLotOnlyBuyer', {response: 0})
    console.log('LOT ONLY BUYER INSERT ERROR', err) ; throw err
  }).finally(() => knex.destroy())
})

// FUNCTION TO ADD NEW HOUSE AND LOT BUYER IN DB
ipcMain.on('addHouseAndLotBuyer', (event, data) => {
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
      project_id: unit.project_id,
      realty: unit.realty_name,
      agent: unit.agent_name,
      agent_number: unit.agent_number,
      status: 1,
      assumer_id: null,
      reservation_type: payment_details.reservation_type
    })
    .returning('id')
    .into('Buyer')
    .then((id) => {
      console.log('INSERTED', id)
      const buyer_id = id
      const knex2 = getDbConnection()
      knex2.insert({
        buyer_id: buyer_id,
        date: payment_details.date,
        total_contract_price: payment_details.total_contract_price,
        reservation_type: payment_details.reservation_type,
        reservation_fee: payment_details.reservation_fee,
        required_equity_percentage: payment_details.required_equity_percentage,
        required_equity_amount: payment_details.required_equity_amount,
        equity_net_of_reservation_fee: payment_details.equity_net_of_reservation_fee,
        equity_months: payment_details.equity_months,
        monthly_equity_amount: payment_details.monthly_equity_amount,
        equity_start_date: payment_details.equity_start_date,
        equity_end_date: payment_details.equity_end_date,
        balance_loanable_percentage: payment_details.balance_loanable_percentage,
        balance_loanable_amount: payment_details.balance_loanable_amount,
        spot_cash_equity_less_percentage: payment_details.spot_cash_equity_less_percentage,
        spot_cash_equity_less_amount: payment_details.spot_cash_equity_less_amount,
        net_equity_less_discount: payment_details.net_equity_less_discount,
        spot_cash_discount_less_percentage: payment_details.spot_cash_discount_less_percentage,
        spot_cash_discount_less_amount: payment_details.spot_cash_discount_less_amount,
        net_total_contract_price: payment_details.net_total_contract_price,
        balance_total_contract_price: payment_details.balance_total_contract_price,
        balance_amount_after_reservation: payment_details.balance_amount_after_reservation,
        installment_months: payment_details.installment_months,
        monthly_installment: payment_details.monthly_installment,
        new_balance_loanable_amount: payment_details.new_balance_loanable_amount
      })
      .into('hl_payment')
      .then(() => {
        const knex3 = getDbConnection()
        knex3('Lot').where({ id: unit.lot_id  })
        .update({
          'status': 1,
          'owner_id': buyer_id,
          'price_per_sqm': unit.price_per_sqm,
          'lot_type': unit.lot_type,
          'lot_area': unit.lot_area,
          'floor_area': unit.floor_area
        }).then(() => {
          // event.reply('addedHouseAndLotBuyer', 1)
          event.reply('addedHouseAndLotBuyer', {response: 1, new_id: buyer_id})
          console.log('LOT STATUS UPDATED', unit.lot_id)
        }).catch((err) => {
          event.reply('addedHouseAndLotBuyer', {response: 0})
          console.log('ADDING OF PAYMENT ERROR', err) ; throw err
        }).finally(() => knex3.destroy())
      // edit to only one lot updated (where statement)
      }).catch((err) => {
        console.log('LOT STATUS UPDATE ERROR', err) ; throw err
      }).finally(() => knex2.destroy())
      // event.reply('isBuyerAdded', 1)
  }).catch((err) => {
    event.reply('addedHouseAndLotBuyer', {response: 0})
    console.log('HOUSE & LOT BUYER INSERT ERROR', err) ; throw err
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

// FUNCTION TO FETCH PHASES UNDER PROJECT ID
ipcMain.on('fetchPhasesList', (event, data) => {
  console.log('Fetching all PHASES under Project ID', data)
  const knex = getDbConnection()
  knex('Phase').where({ project_id: data }).then((phases) => {
    event.reply('fetchedPhasesList', phases)
  }).catch((err) => { console.log('FETCH PHASES LIST ERROR', err) ; throw err
  }).finally(() => knex.destroy())
})

// FUNCTION TO FETCH ALL PHASES
ipcMain.on('fetchAllPhases', (event, data) => {
  console.log('Fetching ALL PHASES')
  const knex = getDbConnection()
  knex('Phase').select().then((phases) => {
    event.reply('fetchedAllPhases', phases)
  }).catch((err) => { console.log('FETCH ALL PHASES LIST ERROR', err) ; throw err
  }).finally(() => knex.destroy())
})

// FUNCTION TO FETCH BLOCKS UNDER PHASE ID/PROJECT ID
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

// FUNCTION TO FETCH ALL BLOCKS
ipcMain.on('fetchAllBlocks', (event, data) => {
  console.log('Fetching ALL BLOCKS')
  const knex = getDbConnection()
  knex('Block').select().then((blocks) => {
    event.reply('fetchedAllBlocks', blocks)
  }).catch((err) => { console.log('FETCH ALL BLOCKS LIST ERROR', err) ; throw err
  }).finally(() => knex.destroy())
})

// FUNCTION TO FETCH LOTS UNDER BLOCK ID
ipcMain.on('fetchLotsList', (event, data) => {
  console.log('Fetching all LOTS under Block ID', data)
  const knex = getDbConnection()
  knex('Lot').where({ block_id: data }).then((lots) => {
    event.reply('fetchedLotsList', lots)
  }).catch((err) => { console.log('FETCH LOTS LIST ERROR', err) ; throw err
  }).finally(() => knex.destroy())
})

// FUNCTION TO FETCH ALL LOTS
ipcMain.on('fetchAllLots', (event, data) => {
  console.log('Fetching ALL LOTS')
  const knex = getDbConnection()
  knex('Lot').select().then((lots) => {
    event.reply('fetchedAllLots', lots)
  }).catch((err) => { console.log('FETCH ALL LOTS LIST ERROR', err) ; throw err
  }).finally(() => knex.destroy())
})


// FUNCTION TO FETCH ALL HL RESERVATIONS
ipcMain.on('fetchAllHLReservations', (event, data) => {
  console.log('Fetching ALL HL RESERVATIONS')
  const knex = getDbConnection()
  knex('hl_payment').select().then((lots) => {
    event.reply('fetchedAllHLReservations', lots)
  }).catch((err) => { console.log('FETCH ALL HL RESERVATIONS ERROR', err) ; throw err
  }).finally(() => knex.destroy())
})

// FUNCTION TO FETCH ALL LOT ONLY RESERVATIONS
ipcMain.on('fetchAllLotOnlyReservations', (event, data) => {
  console.log('Fetching ALL LOT ONLY RESERVATIONS')
  const knex = getDbConnection()
  knex('lot_payment').select().then((lots) => {
    event.reply('fetchedAllLotOnlyReservations', lots)
  }).catch((err) => { console.log('FETCH ALL LOT ONLY RESERVATIONS ERROR', err) ; throw err
  }).finally(() => knex.destroy())
})

// FUNCTION TO FETCH ALL BUYERS
ipcMain.on('fetchBuyersList', (event, data) => {
  const knex = getDbConnection()
  knex('Buyer').select().orderBy('last_name', 'asc').then((buyers) => {
    event.reply('fetchedBuyersList', buyers)
  }).catch((err) => { console.log('FETCH BUYERS LIST ERROR', err) ; throw err
  }).finally(() => knex.destroy())
})

// FUNCTION TO FETCH ALL PAYMENTS OF ALL BUYERS
ipcMain.on('fetchAllPayments', (event, data) => {
  console.log('Fetching ALL PAYMENTS OF ALL BUYERS')
  const knex = getDbConnection()
  knex('buyer_payment').select().then((lots) => {
    event.reply('fetchedAllPayments', lots)
  }).catch((err) => { console.log('Fetching ALL PAYMENTS OF ALL BUYERS ERROR', err) ; throw err
  }).finally(() => knex.destroy())
})

// FUNCTION TO FETCH ALL ACTIVE OR INACTIVE BUYERS
ipcMain.on('fetchActiveOrInactiveBuyersList', (event, data) => {
  const knex = getDbConnection()
  knex('Buyer').where({ status: data })
  .orderBy('last_name', 'asc')
  .then((buyers) => {
    event.reply('fetchedActiveOrInactiveBuyersList', buyers)
  }).catch((err) => { console.log('FETCH BUYERS LIST ERROR', err) ; throw err
  }).finally(() => knex.destroy())
})

// FUNCTION TO FETCH ALL BUYERS OF A SPECIFIC PROJECTS
ipcMain.on('fetchBuyersByProjectList', (event, data) => {
  const { project_id, status} = data
  const knex = getDbConnection()
  knex('Buyer').where({ project_id: project_id, status: status })
    .orderBy('last_name', 'asc')
    .then((buyers) => {
    // event.reply('fetchedBuyersByProjectList', buyers)
    event.reply('fetchedBuyersByProjectList', { response: 1, buyers: buyers })
  }).catch((err) => {
    event.reply('fetchedBuyersByProjectList', { response: 0 })
    console.log('FETCH BUYERS LIST ERROR', err) ; throw err
  }).finally(() => knex.destroy())
})

// FUNCTION TO FETCH ALL BUYERS OF A SPECIFIC PROJECTS WITHOUT STATUS
ipcMain.on('fetchBuyersByProjectListNoStatus', (event, data) => {
  const { project_id } = data
  const knex = getDbConnection()
  knex('Buyer').where({ project_id: project_id })
  .orderBy('last_name', 'asc')
  .then((buyers) => {
    // event.reply('fetchedBuyersByProjectList', buyers)
    event.reply('fetchedBuyersByProjectListNoStatus', { response: 1, buyers: buyers })
  }).catch((err) => {
    event.reply('fetchedBuyersByProjectListNoStatus', { response: 0 })
    console.log('FETCH BUYERS LIST ERROR', err) ; throw err
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

// FUNCTION TO FETCH PAYMENT LOT ONLY
ipcMain.on('fetchLotOnlyPayment', (event, data) => {
  console.log('fetchLotOnlyPayment', data)
  const knex = getDbConnection()
  knex('lot_payment')
    .where({ buyer_id: data })
    .then((lot_payment) => {
      if(lot_payment[0]) {
        console.log('FETCHING LOT PAYMENT', lot_payment[0])
        event.reply('fetchedLotOnlyPayment', lot_payment[0])
      } else {
        console.log(`Lot Payment with BUYER_ID ${data} does not exist`)
        event.reply('fetchedLotOnlyPayment', `Project Type with id ${data} does not exist`)
      }
    }).catch((err) => { console.log('FETCH PROJECT TYPE ERROR', err) ; throw err
  }).finally(() => knex.destroy())
})

// FUNCTION TO FETCH PAYMENT HOUSE AND LOT
ipcMain.on('fetchHouseAndLotPayment', (event, data) => {
  console.log('fetchHouseAndLotPayment', data)
  const knex = getDbConnection()
  knex('hl_payment')
    .where({ buyer_id: data })
    .then((hl_payment) => {
      if(hl_payment[0]) {
        console.log('FETCHING HOUSE AND LOT PAYMENT', hl_payment[0])
        event.reply('fetchedHouseAndLotPayment', hl_payment[0])
      } else {
        console.log(`HOUSE AND LOT Payment with BUYER_ID ${data} does not exist`)
        event.reply('fetchedHouseAndLotPayment', `Project Type with id ${data} does not exist`)
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
          event.reply('forefeitedBuyer', 1)
        }).catch((err) => {
          console.log('UPDATING LOT AFTER FOREFEITING BUYER ERROR', err)
          event.reply('forefeitedBuyer', 0)
          // throw err
        }).finally(() => knex2.destroy())
    }).catch((err) => {
      console.log('FOREFEITING OF BUYER ERROR', err)
      throw err
    }).finally(() => knex.destroy())
})



// FUNCTION TO ON HOLD LOTS
ipcMain.on('onHoldLots', (event, data) => {
  const { selected_lots } = data
  selected_lots.forEach(selected_lot => {
    const knex = getDbConnection()
    knex('lot')
      .where({ id: selected_lot  })
      .update({
        'status': 2
      }).then(() => {
        console.log('LOT is not ON HOLD', selected_lot)
        // Reopen lot, clear owner id
          event.reply('heldLots', 1)
      }).catch((err) => {
        console.log('ON HOLD LOT ERROR', err)
        throw err
      }).finally(() => knex.destroy())
  })
})

// FUNCTION TO REOPEN HELD LOTS
ipcMain.on('reopenLots', (event, data) => {
  const { selected_lots } = data
  selected_lots.forEach(selected_lot => {
    const knex = getDbConnection()
    knex('lot')
      .where({ id: selected_lot  })
      .update({
        'status': 0
      }).then(() => {
        console.log('LOT is now REOPENED', selected_lot)
        // Reopen lot, clear owner id
          event.reply('reopenedLots', 1)
      }).catch((err) => {
        console.log('REOPEN LOT ERROR', err)
        throw err
      }).finally(() => knex.destroy())
  })
})


// FUNCTION TO ADD BUYER PAYMENT IN DB
ipcMain.on('addPayment', (event, data) => {
  console.log('addPayment', data)
  const { id, payment } = data
  console.log('addPayment', data)
  console.log({id}, {payment})
  const knex = getDbConnection()
  knex('buyer_payment').where({ id: id  })
  .insert({
      payment_date: payment.payment_date,
      reference_no: payment.reference_no,
      or_ar_no: payment.or_ar_no,
      transaction_code: payment.transaction_code,
      payment_via: payment.payment_via,
      amount: payment.amount,
      penalty: payment.penalty,
      remarks: payment.remarks,
      isDeductible: payment.isDeductible,
      buyer_id: id
    })
    .then(() => {
      console.log('ADD buyer_payment successful')
      event.reply('addedPayment', 1)
    }).catch((err) => {
      event.reply('addedPayment', 0)
      console.log('FOREFEITING OF BUYER ERROR', err) ; throw err
    }).finally(() => knex.destroy())
})

// FUNCTION TO FETCH BUYER PAYMENTS IN DB
ipcMain.on('fetchPaymentsList', (event, data) => {
  const knex = getDbConnection()
  knex('buyer_payment').where({ buyer_id: data.id  })
    .orderBy('payment_date', 'desc')
    .orderBy('id', 'desc')
    .then((buyer_payments) => {
      console.log('fetchPaymentsList BUYER ID', data.id, buyer_payments)
      event.reply('fetchedPaymentsList', { response: 1, buyer_payments: buyer_payments })
  }).catch((err) => {
    event.reply('fetchedPaymentsList', { response: 0 })
    console.log('FETCH BUYER PAYMENTS ERROR', err) ; throw err
  }).finally(() => knex.destroy())
})

// FUNCTION TO SPECIFIC BUYER PAYMENTS IN DB
ipcMain.on('fetchPayment', (event, data) => {
  const knex = getDbConnection()
  knex('buyer_payment').where({ id: data })
    .then((buyer_payment) => {
      console.log('fetchedPayment BUYER ID', data, buyer_payment)
      event.reply('fetchedPayment', { response: 1, buyer_payment: buyer_payment[0] })
  }).catch((err) => {
    event.reply('fetchedPayment', { response: 0 })
    console.log('FETCH BUYER PAYMENT ERROR', err) ; throw err
  }).finally(() => knex.destroy())
})

// FUNCTION TO FETCH ALL LIST OF CHANGES IN HISTORY
ipcMain.on('fetchHistoryList', (event, data) => {
  console.log('Fetching History List')
  const knex = getDbConnection()
  knex('history_tracker').orderBy('date_of_change', 'desc').then((list) => {
    // event.reply('fetchedBuyersByProjectList', buyers)
    event.reply('fetchedHistoryList', { response: 1, list: list })
  }).catch((err) => {
    event.reply('fetchedHistoryList', { response: 0 })
    console.log('FETCH HISTORY LIST ERROR', err) ; throw err
  }).finally(() => knex.destroy())
})

// FUNCTION TO ADD CHANGE IN HISTORY
ipcMain.on('addHistoryEntry', (event, data) => {
  console.log('addHistoryEntry', data)
  const knex = getDbConnection()
  knex('history_tracker').insert({
      date_of_change: data.date_of_change,
      action: data.action,
      object_id: data.object_id,
      object_name: data.object_name,
      object_type: data.object_type,
      object_field: data.object_field,
      old_value: data.old_value,
      new_value: data.new_value
    })
    .then(() => {
      console.log('ADD HISTORY ENTRY successful')
      event.reply('addedHistoryEntry', 1)
    }).catch((err) => {
      event.reply('addedHistoryEntry', 0)
      console.log('ADD HISTORY ENTRY FAILED', err) ; throw err
    }).finally(() => knex.destroy())
})


// FUNCTION TO EDIT BUYER INFORMATION
ipcMain.on('editBuyerInfo', (event, data) => {
  console.log('editBuyerInfo', data)
  const date = new Date()
  const error_msgs = []
  const { changed_buyer_info,
          unedited_buyer_info,
          
          changed_unit,
          unedited_unit,
        
          changed_payment,
          unedited_payment } = data

  const lname = changed_buyer_info.last_name ? changed_buyer_info.last_name : unedited_buyer_info.last_name
  const fname = changed_buyer_info.first_name ? changed_buyer_info.first_name : unedited_buyer_info.first_name
  const mi = changed_buyer_info.middle_initial ? changed_buyer_info.middle_initial : unedited_buyer_info.middle_initial
  
  if(Object.keys(changed_buyer_info).length) {
    const knex = getDbConnection()
    knex('buyer').where({id: data.id})
      .update(changed_buyer_info)
      .then(() => {
        // add changes to history tracker
        for(const field in changed_buyer_info) {
          const knex2 = getDbConnection()
          knex2('history_tracker').insert({
            date_of_change: date,
            action: 'EDIT',
            object_id: changed_buyer_info.id,
            object_name: `${unedited_buyer_info.project.name} - ${lname} ${fname} ${mi}`,
            object_type: 'BUYER',
            object_field: field,
            old_value: unedited_buyer_info[field],
            new_value: changed_buyer_info[field]
          })
          .then(() => {
            console.log('ADD HISTORY ENTRY successful')
          }).catch((err) => {
            error_msgs.push('ADD HISTORY ENTRY FAILED')
            console.log('ADD HISTORY ENTRY FAILED', err) ; throw err
          }).finally(() => knex2.destroy())
        }
        event.reply('editedBuyerInfo', {response: 1} )
      }).catch((err) => {
        error_msgs.push('UPDATE BUYER INFORMATION failed')
        event.reply('editedBuyerInfo', {response: 0, error: error_msgs })
        console.log('UPDATE BUYER INFORMATION failed', err) ; throw err
      }).finally(() => knex.destroy())
  }

  if(Object.keys(changed_unit).length) {
    const knex3 = getDbConnection()
    knex3('lot').where({id: unedited_unit.id})
      .update(changed_unit)
      .then(() => {
        // add changes to history tracker
        for(const field in changed_unit) {
          const knex4 = getDbConnection()
          knex4('history_tracker').insert({
            date_of_change: date,
            action: 'EDIT',
            object_id: changed_buyer_info.id,
            object_name: `${unedited_buyer_info.project.name} - ${lname} ${fname} ${mi}`,
            object_type: 'UNIT: LOT',
            object_field: field,
            old_value: unedited_unit[field],
            new_value: changed_unit[field]
          })
          .then(() => {
            console.log('ADD HISTORY ENTRY successful')
          }).catch((err) => {
            error_msgs.push('ADD HISTORY ENTRY FAILED')
            console.log('ADD HISTORY ENTRY FAILED', err) ; throw err
          }).finally(() => knex4.destroy())
        }
        event.reply('editedBuyerInfo', {response: 1} )
      }).catch((err) => {
        error_msgs.push('UPDATE BUYER INFORMATION failed')
        event.reply('editedBuyerInfo', {response: 0, error: error_msgs })
        console.log('UPDATE BUYER INFORMATION failed', err) ; throw err
      }).finally(() => knex3.destroy())
  }

  if(Object.keys(changed_payment).length) {
    const knex5 = getDbConnection()
    let payment_db = ''
    switch(unedited_payment.reservation_type) {
      case 1:
      case 2:
      case 3:
      case 4:
        payment_db = 'hl_payment'
        break;
      case 5:
      case 6:
      case 7:
        payment_db = 'lot_payment'
    }
    knex5(payment_db).where({id: unedited_payment.id})
      .update(changed_payment)
      .then(() => {
        // add changes to history tracker
        for(const field in changed_payment) {
          const knex6 = getDbConnection()
          knex6('history_tracker').insert({
            date_of_change: date,
            action: 'EDIT',
            object_id: changed_buyer_info.id,
            object_name: `${unedited_buyer_info.project.name} - ${lname} ${fname} ${mi}`,
            object_type: 'UNIT: LOT',
            object_field: field,
            old_value: unedited_payment[field],
            new_value: changed_payment[field]
          })
          .then(() => {
            console.log('ADD HISTORY ENTRY (buyer reservation) successful')
          }).catch((err) => {
            error_msgs.push('ADD HISTORY ENTRY (buyer reservation) FAILED')
            console.log('ADD HISTORY ENTRY FAILED', err) ; throw err
          }).finally(() => knex6.destroy())
        }
        event.reply('editedBuyerInfo', {response: 1} )
      }).catch((err) => {
        error_msgs.push('UPDATE BUYER RESERVATION INFORMATION failed')
        event.reply('editedBuyerInfo', {response: 0, error: error_msgs })
        console.log('UPDATE BUYER RESERVATION INFORMATION failed', err) ; throw err
      }).finally(() => knex5.destroy())
  }
  
})

// FUNCTION TO EDIT PAYMENT INFORMATION
ipcMain.on('editPayment', (event, data) => {
  console.log('editPayment', data)
  const date = new Date()
  const error_msgs = []
  const { changed_data, unedited_payment, buyer } = data

  const lname = changed_data.last_name ? changed_data.last_name : buyer.last_name
  const fname = changed_data.first_name ? changed_data.first_name : buyer.first_name
  const mi = changed_data.middle_initial ? changed_data.middle_initial : buyer.middle_initial

  const knex = getDbConnection()
  knex('buyer_payment').where({id: data.id})
    .update(changed_data)
    .then(() => {
      // add changes to history tracker
      for(const field in changed_data) {
        const knex2 = getDbConnection()
        knex2('history_tracker').insert({
          date_of_change: date,
          action: 'EDIT',
          object_id: changed_data.id,
          object_name: `${buyer.project.name} - ${lname} ${fname} ${mi}`,
          object_type: 'PAYMENT',
          object_field: field,
          old_value: unedited_payment[field],
          new_value: changed_data[field]
        })
        .then(() => {
          console.log('ADD HISTORY ENTRY successful')
        }).catch((err) => {
          error_msgs.push('ADD HISTORY ENTRY FAILED')
          console.log('ADD HISTORY ENTRY FAILED', err) ; throw err
        }).finally(() => knex2.destroy())
      }
      event.reply('editedPayment', {response: 1} )
    }).catch((err) => {
      error_msgs.push('UPDATE PAYMENT failed')
      event.reply('editedPayment', {response: 0, error: error_msgs })
      console.log('UPDATE PAYMENT failed', err) ; throw err
    }).finally(() => knex.destroy())
})

// // FUNCTION TO ASSUME HOUSE AND LOT UNIT
ipcMain.on('assume-HL-unit', (event, data) => {
  const { newBuyer, payment_details, old_id } = data
  console.log({newBuyer}, {payment_details})
  makeBuyerInactive(old_id)
    const knex = getDbConnection()
    knex.insert({
        last_name: newBuyer.last_name,
        first_name: newBuyer.first_name,
        middle_initial: newBuyer.middle_initial,
        contact_number: newBuyer.contact_number,
        email_address: newBuyer.email_address,
        home_address: newBuyer.home_address,
        lot_id: newBuyer.lot.id,
        project_id: newBuyer.project.id,
        realty: newBuyer.realty_name,
        agent: newBuyer.agent_name,
        agent_number: newBuyer.agent_number,
        status: 1,
        assumer_id: old_id,
        reservation_type: payment_details.reservation_type
      })
      .returning('id')
      .into('Buyer')
      .then((id) => {
        console.log('INSERTED', id)
        const buyer_id = id
        const knex2 = getDbConnection()
        knex2.insert({
          buyer_id: buyer_id,
          date: payment_details.date,
          total_contract_price: payment_details.total_contract_price,
          reservation_type: payment_details.reservation_type,
          reservation_fee: payment_details.reservation_fee,
          required_equity_percentage: payment_details.required_equity_percentage,
          required_equity_amount: payment_details.required_equity_amount,
          equity_net_of_reservation_fee: payment_details.equity_net_of_reservation_fee,
          equity_months: payment_details.equity_months,
          monthly_equity_amount: payment_details.monthly_equity_amount,
          equity_start_date: payment_details.equity_start_date,
          equity_end_date: payment_details.equity_end_date,
          balance_loanable_percentage: payment_details.balance_loanable_percentage,
          balance_loanable_amount: payment_details.balance_loanable_amount,
          spot_cash_equity_less_percentage: payment_details.spot_cash_equity_less_percentage,
          spot_cash_equity_less_amount: payment_details.spot_cash_equity_less_amount,
          net_equity_less_discount: payment_details.net_equity_less_discount,
          spot_cash_discount_less_percentage: payment_details.spot_cash_discount_less_percentage,
          spot_cash_discount_less_amount: payment_details.spot_cash_discount_less_amount,
          net_total_contract_price: payment_details.net_total_contract_price,
          balance_total_contract_price: payment_details.balance_total_contract_price,
          balance_amount_after_reservation: payment_details.balance_amount_after_reservation,
          installment_months: payment_details.installment_months,
          monthly_installment: payment_details.monthly_installment,
        })
        .into('hl_payment')
        .then(() => {
          const knex3 = getDbConnection()
          knex3('Lot').where({ id: newBuyer.lot.id  })
          .update({
            'status': 1,
            'owner_id': buyer_id,
            'price_per_sqm': newBuyer.lot.price_per_sqm,
            'lot_type': newBuyer.lot.lot_type
          }).then(() => {
            
            event.reply('assumed-HL-unit', {response: 1, new_id: buyer_id})
            console.log('LOT STATUS UPDATED', newBuyer.lot.id)
          }).catch((err) => {
            event.reply('assumed-HL-unit', {response: 0})
            console.log('ADDING OF PAYMENT ERROR', err) ; throw err
          }).finally(() => knex3.destroy())
        // edit to only one lot updated (where statement)
        }).catch((err) => {
          console.log('LOT STATUS UPDATE ERROR', err) ; throw err
        }).finally(() => knex2.destroy())
        // event.reply('isBuyerAdded', 1)
    }).catch((err) => {
      event.reply('assumed-HL-unit', {response: 0})
      console.log('HOUSE & LOT BUYER INSERT ERROR', err) ; throw err
    }).finally(() => knex.destroy())
})

// // FUNCTION TO ASSUME LOT ONLY UNIT
ipcMain.on('assume-LO-unit', (event, data) => {
  const { newBuyer, payment_details, old_id } = data
  console.log({newBuyer}, {payment_details})
  makeBuyerInactive(old_id)
    const knex = getDbConnection()
    knex.insert({
        last_name: newBuyer.last_name,
        first_name: newBuyer.first_name,
        middle_initial: newBuyer.middle_initial,
        contact_number: newBuyer.contact_number,
        email_address: newBuyer.email_address,
        home_address: newBuyer.home_address,
        lot_id: newBuyer.lot.id,
        project_id: newBuyer.project.id,
        realty: newBuyer.realty_name,
        agent: newBuyer.agent_name,
        agent_number: newBuyer.agent_number,
        status: 1,
        assumer_id: old_id,
        reservation_type: payment_details.reservation_type
      })
      .returning('id')
      .into('Buyer')
      .then((id) => {
        console.log('INSERTED', id)
        const buyer_id = id
        const knex2 = getDbConnection()
        knex2.insert({
          buyer_id: buyer_id,
          date: payment_details.date,
          reservation_type: payment_details.reservation_type,
          total_contract_price: payment_details.total_contract_price,
          monthly_installment: payment_details.monthly_installment,
          installment_months: payment_details.installment_months,
          reservation_fee: payment_details.reservation_fee,
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
          knex3('Lot').where({ id: newBuyer.lot.id  })
          .update({
            'status': 1,
            'owner_id': buyer_id,
            'price_per_sqm': newBuyer.lot.price_per_sqm,
            'lot_type': newBuyer.lot.lot_type
          }).then(() => {
            
            event.reply('assumed-LO-unit', {response: 1, new_id: buyer_id})
            console.log('LOT STATUS UPDATED', newBuyer.lot.id)
          }).catch((err) => {
            event.reply('assumed-LO-unit', {response: 0})
            console.log('ADDING OF PAYMENT ERROR', err) ; throw err
          }).finally(() => knex3.destroy())
        // edit to only one lot updated (where statement)
        }).catch((err) => {
          console.log('LOT STATUS UPDATE ERROR', err) ; throw err
        }).finally(() => knex2.destroy())
        // event.reply('isBuyerAdded', 1)
    }).catch((err) => {
      event.reply('assumed-HL-unit', {response: 0})
      console.log('HOUSE & LOT BUYER INSERT ERROR', err) ; throw err
    }).finally(() => knex.destroy())
})

function makeBuyerInactive(id) {
  const knex = getDbConnection()
  knex('Buyer')
    .where({ id: id  })
    .update({
      'status': 0
    }).then(() => {
      console.log('BUYER STATUS UPDATED: Buyer now INACTIVE', id)
    }).catch((err) => {
      console.log('BUYER STATUS UPDATE ERROR: Buyer still ACTIVE', err) ; throw err
  }).finally(() => knex.destroy())  
  // _callback()
}


// FUNCTION TO CONNECT DB mysql
// function getDbConnection() {
//   const knex = require('knex')({
//     client: 'mysql',
//     connection: {
//       host: '192.168.1.33',
//       // host: '192.168.254.142',
//       user: 'user',
//       password: 'password',
//       database: 'tumabini_db'
//     }
//   })
//   return knex
// }

// function getDbConnection() {
//   const knex = require('knex')({
//     client: 'mysql',
//     connection: {
//       host: '192.168.1.6',
//       user: 'user',
//       password: 'password',
//       database: 'tumabini_db'
//     }
//   })
//   return knex
// }

// function getDbConnection() {
//   const knex = require('knex')({
//     client: 'mysql',
//     connection: {
//       host: '192.168.1.2',
//       user: 'user',
//       password: 'password',
//       database: 'tumabini_db'
//     }
//   })
//   return knex
// }

// function getDbConnection() {
//   const knex = require('knex')({
//     client: 'mysql',
//     connection: {
//       host: '192.168.1.41',
//       user: 'user',
//       password: 'password',
//       database: 'tumabini_db'
//     }
//   })
//   return knex
// }

function getDbConnection() {
  console.log('getdbconnection')
  const knex = require('knex')({
    client: 'mysql', 
    connection: {
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'tumabini_db'
    }
  })
  return knex
}