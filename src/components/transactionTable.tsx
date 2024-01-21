import React,{ Component } from 'react';
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Transaction {
  ID: number;
  Time: string;
  CategoryName: string;
  Amount: number;
  Description: string;
  SplitTag: string;
}

interface newTransaction{
  Amount: number,
  Description: string,
  Category: string,
  SplitTag: string
}


interface TransactionsProps {
  transactions: Transaction[];
  fetchTransactions: ()=> void;
  email: string|null;
  password: string|null;
}

interface TransactionsState {
  splitTransactions: Transaction[];
  openDeleteDialog: boolean;
  openEditDialog: boolean;
  openNewDialog: boolean;
  currentTransaction: Transaction;
  openDeleteSplitsDialog: boolean;
  newTransaction: newTransaction;
  categories: string[],
  splitTags: string[],
  email: string|null,
  password: string|null
}



class Transactions extends Component<TransactionsProps, TransactionsState> {
  constructor(props: TransactionsProps) {
    super(props);
    this.state = {
      splitTransactions: props.transactions,
      email: props.email,
      password: props.password,
      openDeleteDialog: false,
      openEditDialog: false,
      openDeleteSplitsDialog: false,
      openNewDialog: false,
      currentTransaction: {
        ID: 0,
        Time: "", 
        CategoryName: "",
        Amount: 0, 
        Description: "",
        SplitTag: "",
      },
      newTransaction: {
        Amount: 0,
        Description: "",
        Category: "",
        SplitTag: ""
      },
      categories: [],
      splitTags: []
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

  newTransaction = () => {
    const handleInputChange = (key: string, value: string| number) => {
      this.setState((prevState) => ({
        newTransaction: {
          ...prevState.newTransaction,
          [key]: value,
        },
      }));
    };

    const logTransaction = () =>{
      console.log("logged trans");
      this.setState({openNewDialog:false})
    }
    
    const fetchCategories = async () => {
      const data = {
        email: this.state.email,
        password: this.state.password,
      };
  
      const url = 'https://karchu.onrender.com/v1/categories/all';
      const options: RequestInit = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : null,
      };
  
      try {
        const response = await fetch(url, options);
        const data: [] = await response.json();
        this.setState({categories:data})
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const fetchSplitTags = async() => { 
      const url = 'https://karchu.onrender.com/v1/split-tags';
      const options: RequestInit = {
        method: 'GET'
      };
  
      try {
        const response = await fetch(url, options);
        const data: [] = await response.json();
        this.setState({splitTags:data})
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  
    // Fetch categories when the dialog is opened
    React.useEffect(() => {
      if (this.state.openNewDialog) {
        fetchCategories();
        fetchSplitTags();
      }
    }, [this.state.openNewDialog]);
  



    return(
      <Dialog open={this.state.openNewDialog}>
        <DialogTrigger asChild>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>New Transaction</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
          {
                Object.entries(this.state.newTransaction).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor={key} className="text-right">
                          {key}
                    </Label>
                    {
                        key === "Category" ? (
                          <>
                            <Select>
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                              <SelectContent className='p-0 max-h-[250px] overflow-auto'>
                                <SelectGroup>
                                  <SelectLabel>Categories</SelectLabel>
                                  {this.state.categories.map((category) => (
                                    <SelectItem value={category}>{category}</SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </>
                        ) : key === "SplitTag" ? (
                          <>
                            <Select>
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select a split tag" />
                              </SelectTrigger>
                              <SelectContent className='p-0 max-h-[250px] overflow-auto'>
                                <SelectGroup>
                                  <SelectLabel>Split tags</SelectLabel>
                                  {this.state.splitTags.map((SplitTag) => (
                                    <SelectItem value={SplitTag}>{SplitTag}</SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </>
                        ) : key === "Amount" ?(
                          <Input id={key} value={value} type='number' className="col-span-3" onChange={(e) => handleInputChange(key, e.target.value)} />
                        ):(
                          <Input id={key} value={value} className="col-span-3" onChange={(e) => handleInputChange(key, e.target.value)} />
                        )
                    }

                  </div>
                ))
          }
          </div>
          <DialogFooter>
                <Button type="button" variant="secondary" onClick={()=> this.setState({openNewDialog:false})}>
                  Close
                </Button>
            <Button type="submit" onClick={logTransaction}>Log Transaction</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  render() {
    if (this.state.splitTransactions.length === 0) {
      return null; 
    }

    return (
      <>
      <div className="lg:mx-32 lg:py-4">
      
        <this.newTransaction />

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
       <div className="w-full grid justify-items-end my-2">
       <Button onClick={()=> this.setState({openNewDialog:true})}>
          <PlusCircledIcon className="mr-2 h-4 w-4" /> Add Transaction
       </Button>
       </div>
        <Table>
          <TableHeader>
              {this.headers.map((h) => (
                h == "Amount" ?  <TableHead className='text-right' key={h}>{h}</TableHead> :
                <TableHead className='text-center' key={h}>{h}</TableHead>
              ))}
          </TableHeader>
          <TableBody>
            {this.state.splitTransactions.map((transaction) => {
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
