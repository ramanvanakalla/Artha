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
  PlusCircledIcon
} from "@radix-ui/react-icons"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"


import numeral from 'numeral';

interface MoneyLent {
  UnSettledAmount: number;
  SettledAmount: number;
  FriendName: string;
}

interface TransactionsProps {
  transactions: MoneyLent[];
  email: string|null;
  password: string|null;
  fetchTransactions: ()=> void
}

interface TransactionsState {
  moneyFriendTransactions: MoneyLent[];
  openDeleteDialog: boolean;
  openEditDialog: boolean;
  currentTransaction: MoneyLent;
  email: string|null;
  password: string|null;
}


class FriendTransactions extends Component<TransactionsProps, TransactionsState> {
  constructor(props: TransactionsProps) {
    super(props);
    this.state = {
      email: props.email,
      password: props.password,
      moneyFriendTransactions: props.transactions,
      openDeleteDialog: false,
      openEditDialog: false,
      currentTransaction: {
        SettledAmount: 0,
        UnSettledAmount: 0,
        FriendName: ""
      }
    };
  }

  componentDidUpdate(prevProps: TransactionsProps): void {
    if (prevProps.transactions !== this.props.transactions) {
      this.setState({ moneyFriendTransactions: this.props.transactions });
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
    "Settled Amount",
    "UnSettled Amount",
    "Action"
  ]

  render() {

    return (
      <>
     
      <div className="w-full grid justify-items-end my-2">
                <Button>
                    <PlusCircledIcon className="mr-2 h-4 w-4" /> Add Friend
                </Button>
            </div>
        {
            this.state.moneyFriendTransactions.length === 0 ?
            <div className="flex items-center justify-center my-4">
              <p className="leading-7 [&:not(:first-child)]:mt-6 mx-au"> Split Transactions</p>
            </div>
            :
            <Table >
                <TableHeader>
                    {this.headers.map((h) => (
                      (h == "Amount" || h == "NetAmount") ?  <TableHead className='text-right' key={h}>{h}</TableHead> :
                      <TableHead className='text-center' key={h}>{h}</TableHead>
                    ))}
                </TableHeader>
                  <TableBody>
                    {this.state.moneyFriendTransactions.map((transaction) => {  
                      return (
                        <TableRow key={transaction.FriendName}>
                            <TableCell className=" text-center">{transaction.FriendName}</TableCell>
                            <TableCell className=" text-right">₹{numeral(transaction.SettledAmount).format('0,0.00')}</TableCell>
                            <TableCell className=" text-right">₹{numeral(transaction.UnSettledAmount).format('0,0.00')}</TableCell>
                            
                            
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
                                   
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
              </Table>
        }     
      </>
    );
  }
}

export default FriendTransactions;
