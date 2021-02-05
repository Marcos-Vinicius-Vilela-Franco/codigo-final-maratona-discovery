const Modal = {
    open(){
        //abrir modal
        //add class active ao modal
        document.querySelector('.modal-overlay').classList.add('active')
        
    },
    close(){
        //fechar modal
        //remover class active no modal
        document.querySelector('.modal-overlay').classList.remove('active')
    }
}
const Storage = {
    get(){
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
    },
    set(transactions){
        localStorage.setItem("dev.finances:transactions",JSON.stringify(transactions))
    }
}
//transaçoes
const transactions = [
    {
        id:1,
        description:'Luz',
        amount:-50000,
        date: '23/01/2021'
    },
    {
        id:2,
        description:'Website',
        amount: 500000,
        date: '23/01/2021'
    },
    {
        id:3,
        description:'Internet',
        amount:-26900,
        date: '23/01/2021'
    }]

const Transaction = {
    all: Storage.get(),
    add(transaction){
        Transaction.all.push(transaction)
        App.reload()

    },
    remove(index){
        Transaction.all.splice(index,1)
        App.reload()
    },
    incomes(){
        let income = 0;
        //pegar transações
         //para cada transação
        Transaction.all.forEach(transaction=>{
            // verificar se é maior q 0
            if(transaction.amount > 0){
                //somar a uma variável e retornar variavel
                income += transaction.amount;
            }

        })
        //somar entradas
       
        //se for maior somar e retornar
        return income
    },
    expenses(){
        //somar saídas
        let expense = 0;
        //pegar transações
         //para cada transação
        Transaction.all.forEach(transaction=>{
            // verificar se é maior q 0
            if(transaction.amount < 0){
                //somar a uma variável e retornar variavel
                expense += transaction.amount;
            }

        })
        //somar entradas
       
        //se for maior somar e retornar
        return expense
    },
    total(){
        //entradas - saídas
        return Transaction.incomes() + Transaction.expenses()
    }
}
const DOM = {
    transactionsContainer: document.querySelector("#data-table tbody"),
    addTransaction(transaction,index){
        
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction,index)
        tr.dataset.index = index

        DOM.transactionsContainer.appendChild(tr)
    },
    innerHTMLTransaction(transaction,index){

        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency(transaction.amount)

        const html=`
            <td class="description">${transaction.description}</td>
            <td class=${CSSclass}> ${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
            <img onclick="Transaction.remove(${index})"src="./assets/minus.svg" alt="Remover Transação">
            </td>
        `
        return html
    },

    updateBalance(){
        document.getElementById('incomeDisplay').innerHTML = Utils.formatCurrency(Transaction.incomes())
        document.getElementById('expenseDisplay').innerHTML =Utils.formatCurrency( Transaction.expenses())
        document.getElementById('totalDisplay').innerHTML = Utils.formatCurrency(Transaction.total())

    },
    clearTransactions(){
        DOM.transactionsContainer.innerHTML=""
    }
}

const Utils = {
    formatAmount(value){
      
        value = Number(value) * 100
        return value
        
        
    },
    formatDate(date){
        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },
    formatCurrency(value){
        const signal = Number(value) < 0 ? "-" : ""

        value = String(value).replace(/\D/g,"")
        value = Number(value) / 100
        value = value.toLocaleString("pt-BR",{
            style: "currency",
            currency:"BRL"
        })
        return signal + value
    }
}

const Form = {
    description: document.querySelector("input#description"),
    amount: document.querySelector("input#amount"),
    date: document.querySelector("input#date"),

    getValues(){
        return{
            description:Form.description.value,
            amount:Form.amount.value,
            date: Form.date.value
            
        }
    },

    
    validateFilds(){
        
        const {description, amount, date} = Form.getValues()
        
        if(description.trim() === "" || amount.trim() === "" ||   date.trim() ===""){
            
            throw new Error("Por favor, preencha todos os campos")
        }
        
        

    },
    formatValues(){
        let {description, amount, date} = Form.getValues()
        amount = Utils.formatAmount(amount)
        
        date = Utils.formatDate(date)

        
       
        return {
            description,
            amount,
            date
        }
    },
    salveTransaction(transaction){
        Transaction.add(transaction)

    },
    clearFilds(){
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },
    submit(event){
        event.preventDefault()

        try{
            
           Form.validateFilds()
           
            //verificar se os informações foram preenchidos
            //fprmatar os dados para salvar
            const trasation = Form.formatValues()
            Transaction.add(trasation)
           
            //salvar
            Form.clearFilds()
            //apagar os dados do formulario
            //modal feche
            Modal.close()
            //atualizar aplicação
         

        } catch(error){
            alert(error.message)

        }

        

    }
}



const App ={
    init(){
        Transaction.all.forEach(function(transaction,index){
            DOM.addTransaction(transaction,index)
        })
        DOM.updateBalance()

        Storage.set(Transaction.all)

    },
    reload(){
        DOM.clearTransactions()
        App.init()
    },
}
App.init()
//Transaction.remove()

//Transaction.add({
 //   id: 39,
 //   description:"alo",
  //  amount:200,
  //  date: "32/01/2021"
//})