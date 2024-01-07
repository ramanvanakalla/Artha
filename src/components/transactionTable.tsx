import { Component } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button"
import {
  DotsHorizontalIcon,
} from "@radix-ui/react-icons"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { DateTime } from 'luxon';
import numeral from 'numeral';

interface Transaction {
  ID: number;
  Time: string;
  CategoryName: string;
  Amount: number;
  Description: string;
  SplitTag: string;
}

interface TransactionsProps {
  transactions: Transaction[];
  fetchTransactions: ()=> void
}

interface TransactionsState {
  transactions: Transaction[];
  openDeleteDialog: boolean;
  openEditDialog: boolean;
  currentTransaction: Transaction;
  openDeleteSplitsDialog: boolean
}


class Transactions extends Component<TransactionsProps, TransactionsState> {
  constructor(props: TransactionsProps) {
    super(props);
    this.state = {
      transactions: props.transactions,
      openDeleteDialog: false,
      openEditDialog: false,
      openDeleteSplitsDialog: false,
      currentTransaction: {
        ID: 0,
        Time: "", 
        CategoryName: "",
        Amount: 0, 
        Description: "",
        SplitTag: "",
      }
    };
  }

  componentDidUpdate(prevProps: TransactionsProps): void {
    if (prevProps.transactions !== this.props.transactions) {
      // Update state when transactions prop changes
      this.setState({ transactions: this.props.transactions });
    }
  }

  DeleteSplitsOfTransaction(transactionId: number){
    console.log(transactionId)
    const req = {
      email: "ramanvanakalla123@gmail.com",
      password: "Raman@123",
      transactionId: transactionId
    };

    const url = 'https://karchu.onrender.com/v2/split-transaction';
    const options: RequestInit = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: req ? JSON.stringify(req) : null,
    };
    console.log(JSON.stringify(req))
    fetch(url, options)
    .then((response) => response.json())
    .then((data: { success_code?: string; error_code?: string; success_message?: string; error_message?: string }) => {
      console.log(data)
      if (data.success_code) {
        toast.success(data.success_message)
      } else if (data.error_code) {
        toast.error(data.error_message)
      } else {
        console.error('Unexpected response format:', data);
      }
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
  }

  DeleteTransaction(transactionId: number){
    console.log(transactionId)
    const req = {
      email: "ramanvanakalla123@gmail.com",
      password: "Raman@123",
      transactionId: transactionId
    };

    const url = 'https://karchu.onrender.com/v1/transactions';
    const options: RequestInit = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: req ? JSON.stringify(req) : null,
    };
    console.log(JSON.stringify(req))
    fetch(url, options)
    .then((response) => response.json())
    .then((data: { success_code?: string; error_code?: string; success_message?: string; error_message?: string }) => {
      console.log(data)
      if (data.success_code) {
        toast.success(data.success_message)
      } else if (data.error_code) {
        toast.error(data.error_message)
      } else {
        console.error('Unexpected response format:', data);
      }
      this.props.fetchTransactions()
       //this.setState({ transactions: data, loading: false });
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });

  }

  headers = [
    "Date",
    "Time",
    "Category",
    "Amount",
    "Description",
    "SplitTag",
    "Action"
  ]

  render() {
    if (this.state.transactions.length === 0) {
      return null; // or some other fallback UI when there are no transactions
    }

    return (
      <>
      <div className="mx-32 py-4">
      <AlertDialog open={this.state.openDeleteDialog}>
        <AlertDialogTrigger>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Transaction?</AlertDialogTitle>
            <AlertDialogDescription>
              `This action cannot be undone. This will permanently delete Transaction: 
              Category <span className="font-bold">{this.state.currentTransaction.CategoryName}</span> and Amount <span className="font-bold">{this.state.currentTransaction.Amount}</span>`
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={()=>{
                          this.setState({openDeleteDialog: false})
                          }}>
                            Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={()=>{
                          this.setState({openDeleteDialog: false})
                          this.DeleteTransaction(this.state.currentTransaction.ID)
                          }}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
        </AlertDialog>

        <Dialog open={this.state.openEditDialog}>
          <DialogTrigger asChild>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Transaction</DialogTitle>
              <DialogDescription>
                Make changes to your transaction here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {
                Object.entries(this.state.currentTransaction).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor={key} className="text-right">
                      {key}
                    </Label>
                    <Input id={key} value={value} className="col-span-3" />
                  </div>
                ))
              }
            </div> 
            <DialogFooter>
                  <Button type="button" variant="secondary" onClick={()=> this.setState({openEditDialog:false})}>
                    Close
                  </Button>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AlertDialog open={this.state.openDeleteSplitsDialog}>
        <AlertDialogTrigger>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete splits of this transaction?</AlertDialogTitle>
            <AlertDialogDescription>
              `This action cannot be undone. This will permanently delete splits of this transaction: 
              Category <span className="font-bold">{this.state.currentTransaction.CategoryName}</span> and Amount <span className="font-bold">{this.state.currentTransaction.Amount}</span>`
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={()=>{
                          this.setState({openDeleteSplitsDialog: false})
                          }}>
                            Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={()=>{
                          this.setState({openDeleteSplitsDialog: false})
                          this.DeleteSplitsOfTransaction(this.state.currentTransaction.ID)
                          }}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
        </AlertDialog>

        <Table>
          <TableHeader>
            <TableRow>
              {this.headers.map((h) => (
                h == "Amount" ?  <TableHead className='text-right' key={h}>{h}</TableHead> :
                <TableHead className='text-center' key={h}>{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {this.state.transactions.map((transaction) => {
              // Corrected the syntax here
              const dateTime = DateTime.fromISO(transaction.Time, { zone: 'IST' });
              const date = dateTime.toFormat('dd LLL-yyyy');
              const time = dateTime.toFormat('hh:mm a');
              return (
                <TableRow key={transaction.ID}>
                  <TableCell className="w-1/6 text-center">{date}</TableCell>
                  <TableCell className="w-1/6 text-center">{time}</TableCell>
                  <TableCell className="w-1/6 text-center">{transaction.CategoryName}</TableCell>
                  { transaction.Amount < 0 ? 
                      <TableCell className="w-1/12 text-right text-green-400">₹{numeral(transaction.Amount).format('0,0.00')}</TableCell>
                    :
                    <TableCell className="w-1/12 text-right  text-red-400">₹{numeral(transaction.Amount).format('0,0.00')}</TableCell>
                  }
                  <TableCell className="w-1/6 text-center">{transaction.Description}</TableCell>
                  <TableCell className="w-1/6 text-center">{transaction.SplitTag}</TableCell>
                  <TableCell className="w-1/12">
                    <div className='flex items-center justify-center'>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <DotsHorizontalIcon className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={()=>{this.setState({openEditDialog:true, currentTransaction: transaction})}}>Edit Transaction</DropdownMenuItem>                         
                          <DropdownMenuItem onClick={()=>{this.setState({openDeleteDialog:true, currentTransaction: transaction})}}>Delete Transaction</DropdownMenuItem>
                          <DropdownMenuItem onClick={()=>{this.setState({openDeleteSplitsDialog:true, currentTransaction: transaction})}}>Delete Splits</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Split Transaction</DropdownMenuItem>
                          <DropdownMenuItem>View Splits</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
                            
      </>
    );
  }
}

export default Transactions;
