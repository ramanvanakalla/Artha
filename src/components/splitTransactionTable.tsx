import { Component } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area"
import LoadingComponent from './loading';
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
  currentTransaction: SplitTransaction;
  openSettleTransaction: boolean,
  openUnSettleTransaction: boolean,
  email: string|null;
  password: string|null;
  loading: boolean;
}


class SplitTransactions extends Component<TransactionsProps, TransactionsState> {
  constructor(props: TransactionsProps) {
    super(props);
    this.state = {
      email: props.email,
      password: props.password,
      splitTransactions: props.transactions,  
      openSettleTransaction: false,
      openUnSettleTransaction: false,
      loading: false,
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

  settleTransaction = (splitTransactionId: number) => {
    const req = {
      email: this.state.email,
      password: this.state.password,
      splitTransactionId: splitTransactionId
    };
    this.setState({ openSettleTransaction: false, loading: true });
    const url = 'https://karchu.onrender.com/v2/settle';
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: req ? JSON.stringify(req) : null,
    };
    fetch(url, options)
    .then((response) => response.json())
    .then((data: { success_code?: string; error_code?: string; success_message?: string; error_message?: string }) => {
      if (data.success_code) {
        toast.success(data.success_message)
        this.fetchData()
      } else if (data.error_code) {
        toast.error(data.error_message)
      } else {
        console.error('Unexpected response format:', data);
      }
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    })
    .finally(()=>{
      setTimeout(() => {
        this.setState({
          loading: false,
          currentTransaction: {
            SplitTransactionId: 0,
            SourceTransactionId: 0,
            SettledTransactionId: 0,
            CategoryName: "",
            SourceAmount: 0,
            Amount: 0,
            FriendName: ""
          }
        });
      }, 500);
    })
  }

  UnSettleTransaction = (splitTransactionId: number) => {
    const req = {
      email: this.state.email,
      password: this.state.password,
      splitTransactionId: splitTransactionId
    };
    this.setState({ openSettleTransaction: false, loading: true });
    const url = 'https://karchu.onrender.com/v2/settle';
    const options: RequestInit = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: req ? JSON.stringify(req) : null,
    };
    fetch(url, options)
    .then((response) => response.json())
    .then((data: { success_code?: string; error_code?: string; success_message?: string; error_message?: string }) => {
      if (data.success_code) {
        toast.success(data.success_message)
        this.fetchData()
      } else if (data.error_code) {
        toast.error(data.error_message)
      } else {
        console.error('Unexpected response format:', data);
      }
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    })
    .finally(()=>{
      setTimeout(() => {
        this.setState({
          loading: false,
          currentTransaction: {
            SplitTransactionId: 0,
            SourceTransactionId: 0,
            SettledTransactionId: 0,
            CategoryName: "",
            SourceAmount: 0,
            Amount: 0,
            FriendName: ""
          }
        });
      }, 500);
    })
  }
  

  headers = [
    "Friend",
    "Category",
    "Source Amount",
    "Split Amount",
    "Status",
    "Action"
  ]
  fetchData = async () => {
    try {
      await this.props.fetchTransactions();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  settleTransactionComponent = ()=>{
    return(
      <AlertDialog open={this.state.openSettleTransaction}>
      <AlertDialogTrigger>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Settle the transaction?</AlertDialogTitle>
          <AlertDialogDescription>
            Did your friend  <span className="font-bold">{this.state.currentTransaction.FriendName}</span> paid an amount of <span className="font-bold">{this.state.currentTransaction.Amount}</span> to you ??
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={()=>{
                        this.setState({openSettleTransaction: false})
                        }}>
                          Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={()=>{
                        this.setState({openSettleTransaction: false})
                        this.settleTransaction(this.state.currentTransaction.SplitTransactionId)
                        }}>Settle</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
      </AlertDialog>
    )
  }

  UnsettleTransactionComponent = ()=>{
    return(
      <AlertDialog open={this.state.openUnSettleTransaction}>
      <AlertDialogTrigger>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Un-Settle the transaction?</AlertDialogTitle>
          <AlertDialogDescription>
            Unsettle transaction with friend  <span className="font-bold">{this.state.currentTransaction.FriendName}</span> and amount <span className="font-bold">{this.state.currentTransaction.Amount}</span> to you ??
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={()=>{
                        this.setState({openUnSettleTransaction: false})
                        }}>
                          Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={()=>{
                        this.setState({openUnSettleTransaction: false})
                        this.UnSettleTransaction(this.state.currentTransaction.SplitTransactionId)
                        }}>Un-Settle</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
      </AlertDialog>
    )
  }

  render() {

    return (
      <>
      <LoadingComponent loading={this.state.loading}></LoadingComponent>
      { this.state.openSettleTransaction && <this.settleTransactionComponent /> }   
      { this.state.openUnSettleTransaction && <this.UnsettleTransactionComponent /> }    
      <div className="w-full grid justify-items-end my-2">
        <Button>
          <PlusCircledIcon className="mr-2 h-4 w-4" /> Split Transaction
        </Button>
      </div>  
      <div>
        {
            this.state.splitTransactions.length === 0 ?
            <div className="flex items-center justify-center my-4">
              <p className="leading-7 [&:not(:first-child)]:mt-6 mx-au"> Split a transaction !!</p>
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
                                        <DropdownMenuItem onClick={()=>{this.setState({ openUnSettleTransaction: true, currentTransaction: transaction})}}>Unsettle Transaction</DropdownMenuItem> 
                                        :
                                        <DropdownMenuItem onClick={()=>{this.setState({ openSettleTransaction: true, currentTransaction: transaction})}}>Settle Transaction</DropdownMenuItem>               
                                    }
                                    <DropdownMenuItem onClick={()=>{this.setState({ currentTransaction: transaction})}}>Show Source Transaction</DropdownMenuItem>
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
