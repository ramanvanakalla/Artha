import { Component } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area"

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
  PlusCircledIcon
} from "@radix-ui/react-icons"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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

import {
    CheckCircledIcon,
    CrossCircledIcon,
  } from "@radix-ui/react-icons"

import numeral from 'numeral';

interface SplitTransaction {
  SplitTransactionId: number;
  SourceTransactionId: number;
  SettledTransactionId: number;
  CategoryName: string;
  SourceAmount: number;
  Amount: number;
  FriendName: string;
}

interface TransactionsProps {
  transactions: SplitTransaction[];
  email: string|null;
  password: string|null;
  fetchTransactions: ()=> void
}

interface TransactionsState {
  splitTransactions: SplitTransaction[];
  openDeleteDialog: boolean;
  openEditDialog: boolean;
  currentTransaction: SplitTransaction;
  openDeleteSplitsDialog: boolean;
  email: string|null;
  password: string|null;
}


class SplitTransactions extends Component<TransactionsProps, TransactionsState> {
  constructor(props: TransactionsProps) {
    super(props);
    this.state = {
      email: props.email,
      password: props.password,
      splitTransactions: props.transactions,  
      openDeleteDialog: false,
      openEditDialog: false,
      openDeleteSplitsDialog: false,
      currentTransaction: {
        SplitTransactionId: 0,
        SourceTransactionId: 0,
        SettledTransactionId: 0,
        CategoryName: "",
        SourceAmount: 0,
        Amount: 0,
        FriendName: ""
      }
    };
  }

  componentDidUpdate(prevProps: TransactionsProps): void {
    if (prevProps.transactions !== this.props.transactions) {
      // Update state when transactions prop changes
      this.setState({ splitTransactions: this.props.transactions });
    }
  }

  DeleteSplitsOfTransaction(transactionId: number){
    console.log(transactionId)
    const req = {
      email: this.state.email,
      password: this.state.password,
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
      email: this.state.email,
      password: this.state.password,
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
    "Friend",
    "Category",
    "Source Amount",
    "Split Amount",
    "Status",
    "Action"
  ]

  render() {

    return (
      <>
      { this.state.openDeleteDialog && 
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
                          this.DeleteTransaction(this.state.currentTransaction.SplitTransactionId)
                          }}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
        </AlertDialog>
      }
      
      { this.state.openEditDialog &&
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
      }
        
      { this.state.openDeleteSplitsDialog && 
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
                            this.DeleteSplitsOfTransaction(this.state.currentTransaction.SplitTransactionId)
                            }}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
          </AlertDialog>
      }
      <div className="w-full grid justify-items-end my-2">
        <Button>
          <PlusCircledIcon className="mr-2 h-4 w-4" /> Split Transaction
        </Button>
      </div>  
      <div>
        {
            this.state.splitTransactions.length === 0 ?
            <div className="flex items-center justify-center my-4">
              <p className="leading-7 [&:not(:first-child)]:mt-6 mx-au"> Split Transactions</p>
            </div>
            :
            <ScrollArea className="h-screen w-full rounded-md border">
            <Table className='border-collapse border-l w-full'>
                <TableHeader>
                    {this.headers.map((h) => (
                      (h == "Amount" || h == "NetAmount") ?  <TableHead className='text-right' key={h}>{h}</TableHead> :
                      <TableHead className='text-center' key={h}>{h}</TableHead>
                    ))}
                </TableHeader>
                  <TableBody>
                    {this.state.splitTransactions.map((transaction) => {  
                      return (
                        <TableRow key={transaction.SplitTransactionId}>
                            <TableCell className=" text-center">{transaction.FriendName}</TableCell>
                            <TableCell className=" text-center">{transaction.CategoryName}</TableCell>
                            <TableCell className=" text-right">₹{numeral(transaction.SourceAmount).format('0,0.00')}</TableCell>
                            <TableCell className=" text-right">₹{numeral(transaction.Amount).format('0,0.00')}</TableCell>
                            {
                                transaction.SettledTransactionId !== 0?
                                    <TableCell className=''>
                                        <div className='flex items-center justify-center text-green-600'>
                                            <CheckCircledIcon></CheckCircledIcon>
                                            <span className='px-2'> Settled </span>
                                        </div>
                                    </TableCell>
                                :
                                    <TableCell className=''>
                                        <div className='flex items-center justify-center text-red-600'>
                                            <CrossCircledIcon></CrossCircledIcon>
                                            <span className='px-2'>Unsettled </span>
                                        </div>
                                    </TableCell>
                            }
                            
                          <TableCell className="">
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
                                    {
                                        transaction.SettledTransactionId !== 0 ?
                                        <DropdownMenuItem onClick={()=>{this.setState({openEditDialog:true, currentTransaction: transaction})}}>Unsettle Transaction</DropdownMenuItem> 
                                        :
                                        <DropdownMenuItem onClick={()=>{this.setState({openEditDialog:true, currentTransaction: transaction})}}>Settle Transaction</DropdownMenuItem>               
                                    }
                                    <DropdownMenuItem onClick={()=>{this.setState({openDeleteDialog:true, currentTransaction: transaction})}}>Show Source Transaction</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
              </Table>
              </ScrollArea>
        }
        
      </div>
      
                            
      </>
    );
  }
}

export default SplitTransactions;
