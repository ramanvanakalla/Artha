import React,{ Component } from 'react';
import { MultiSelect } from 'primereact/multiselect';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
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
  TimerIcon,
  CheckCircledIcon
} from "@radix-ui/react-icons"
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
import LoadingComponent from './loading';

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
  SplitTag: string,
  ModelSplit: string
}

interface splits{
  friendId: string,
  amount: number
}

interface friendMap{
  FriendId: number,
  FriendName: string
}

interface TransactionsProps {
  transactions: Transaction[];
  fetchTransactions: ()=> void;
  fetchCategories: ()=> void;
  setCategoryFilters: React.Dispatch<React.SetStateAction<string[]>>;
  email: string|null;
  password: string|null;
  categoryNames: {name: string}[]
}

interface TransactionsState {
  Transactions: Transaction[];
  openDeleteDialog: boolean;
  openEditDialog: boolean;
  openSplitDialog: boolean;
  openNewDialog: boolean;
  currentTransaction: Transaction;
  openDeleteSplitsDialog: boolean;
  newTransaction: newTransaction;
  newTransactionError: string;
  categories: string[],
  splitTags: string[],
  modelSplits: string[],
  friends: friendMap[],
  email: string|null,
  password: string|null,
  loading: boolean,
  splits: splits[],
  categoryNames: {name: string}[],
  selectedCategories: {name: string}[]
}



class Transactions extends Component<TransactionsProps, TransactionsState> {
  constructor(props: TransactionsProps) {
    super(props);
    this.state = {
      Transactions: props.transactions,
      email: props.email,
      password: props.password,
      categoryNames: props.categoryNames,
      selectedCategories: [],
      openDeleteDialog: false,
      openEditDialog: false,
      openDeleteSplitsDialog: false,
      openSplitDialog: false,
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
        SplitTag: "",
        ModelSplit: "",
      },
      categories: [],
      splitTags: [],
      modelSplits: [],
      newTransactionError: "",
      loading: false,
      splits: [
        { friendId: "", amount: 0}
      ],
      friends: []
    };
  }

  componentDidUpdate(prevProps: TransactionsProps): void {
    if (prevProps.transactions !== this.props.transactions ) {
      // Update state when transactions prop changes
      this.setState({ Transactions: this.props.transactions });
    }
  }

  DeleteSplitsOfTransaction(transactionId: number){
    this.setState({loading:true})
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
    fetch(url, options)
    .then((response) => response.json())
    .then((data: { success_code?: string; error_code?: string; success_message?: string; error_message?: string }) => {
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
    })
    .finally(()=>{
      setTimeout(() => {
        this.setState({
          currentTransaction: {
            ID: 0,
            Time: "",
            CategoryName: "",
            Amount: 0,
            Description: "",
            SplitTag: "",
          },
          loading: false
        });
      }, 500);
    })
  }

  DeleteTransaction(transactionId: number){
    this.setState({loading:true})
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
    fetch(url, options)
    .then((response) => response.json())
    .then((data: { success_code?: string; error_code?: string; success_message?: string; error_message?: string }) => {
      if (data.success_code) {
        toast.success(data.success_message)
      } else if (data.error_code) {
        toast.error(data.error_message)
      } else {
        console.error('Unexpected response format:', data);
      }
      this.fetchData();
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    })
    .finally(()=>{
      setTimeout(() => {
        this.setState({
          currentTransaction: {
            ID: 0,
            Time: "",
            CategoryName: "",
            Amount: 0,
            Description: "",
            SplitTag: "",
          },
          loading: false
        });
      }, 500);
    })
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

  fetchData = async () => {
    try {
      await this.props.fetchTransactions();
      await this.props.fetchCategories();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  fetchCategories = async () => {
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

  fetchSplitTags = async() => { 
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

  fetchModelSplits = async() =>{
    const url = 'https://karchu.onrender.com/v2/model-split/get';
    const data = {
      email: this.state.email,
      password: this.state.password,
    };

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
      this.setState({modelSplits:data})
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  fetchFriends = async() => {
    const data = {
      email: this.state.email,
      password: this.state.password,
    };

    const url = 'https://karchu.onrender.com/v2/friends/friendsMap';
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : null,
    };

    try {
      const response = await fetch(url, options);
      const data: [friendMap] = await response.json();
      this.setState({friends:data})
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  newTransaction = () => {
    const handleInputChange = (key: string, value: string| number) => {
      this.setState((prevState) => ({
        newTransaction: {
          ...prevState.newTransaction,
          [key]: key === 'Amount' ? parseFloat(String(value)) : value,
        },
      }));
      this.setState({newTransactionError:""});
    };

    const logTransaction = () => {
      if (this.state.newTransaction.Amount <= 0) {
        this.setState({ newTransactionError: "Amount should be positive" });
        return;
      } else if (this.state.newTransaction.Category.length === 0) {
        this.setState({ newTransactionError: "Select a category" });
        return;
      } else if (this.state.newTransaction.SplitTag.length === 0) {
        this.setState({ newTransactionError: "Select a splitTag" });
        return;
      }
    
      this.setState({ openNewDialog: false, newTransactionError: "", loading: true });
      let url = "";
      let req;
      if(this.state.newTransaction.ModelSplit === '' ){
        req = {
          amount: this.state.newTransaction.Amount,
          category: this.state.newTransaction.Category,
          description: this.state.newTransaction.Description,
          splitTag: this.state.newTransaction.SplitTag,
          email: this.state.email,
          password: this.state.password,
        };
      
        url = 'https://karchu.onrender.com/v1/transactions';
      } else{
        req = {
          amount: this.state.newTransaction.Amount,
          category: this.state.newTransaction.Category,
          description: this.state.newTransaction.Description,
          email: this.state.email,
          password: this.state.password,
          ModelSplitName: this.state.newTransaction.ModelSplit
        };
      
        url = 'https://karchu.onrender.com/v1/transactions/model';
      }
      const options: RequestInit = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: req ? JSON.stringify(req) : null,
      };  
    
      fetch(url, options)
        .then((response) => response.json())
        .then((data) => {
          if (data.success_code) {
            toast.success(data.success_message);
            this.fetchData();
          } else if (data.error_code) {
            toast.error(data.error_message);
          } else {
            console.error('Unexpected response format:', data);
          }
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        })
        .finally(() => {
          // Introduce a small delay before setting loading to false
          setTimeout(() => {
            this.setState({
              newTransaction: {
                Amount: 0,
                Description: "",
                Category: "",
                SplitTag: "",
                ModelSplit: ""
              },
              loading: false,
            });
          }, 500); // Adjust the delay time as needed
        });
    };
  
    // Fetch categories when the dialog is opened
    React.useEffect(() => {
      if (this.state.openNewDialog) {
        this.fetchCategories();
        this.fetchSplitTags();
        this.fetchModelSplits();
      }
    }, [this.state.openNewDialog, this.state.loading]);

    return(
      <>
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
                            <Select onValueChange={(value)=>{handleInputChange(key, value)}}>
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
                            <Select onValueChange={(value)=>{handleInputChange(key, value)}}>
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
                        ) : key === "ModelSplit" ?(
                          <>
                            <Select onValueChange={(value)=>{handleInputChange(key, value)}}>
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select a model split" />
                              </SelectTrigger>
                              <SelectContent className='p-0 max-h-[250px] overflow-auto'>
                                <SelectGroup>
                                  <SelectLabel>Model Splits</SelectLabel>
                                  {this.state.modelSplits.map((ModelSplit) => (
                                    <SelectItem value={ModelSplit}>{ModelSplit}</SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </>
                        ): (
                          <Input id={key} value={value} className="col-span-3" onChange={(e) => handleInputChange(key, e.target.value)} />
                        )
                    }
                  </div>
                ))
          }
          </div>
          <DialogFooter>
                <Button type="button" variant="secondary" onClick={()=> this.setState({openNewDialog:false, newTransactionError:""})}>
                  Close
                </Button>
            <Button type="submit" onClick={() => {logTransaction()}}>Log Transaction {this.state.loading}</Button>
          </DialogFooter>
          <p className="leading-7 [&:not(:first-child)]:mt-6 text-red-500">{this.state.newTransactionError}</p>
        </DialogContent>
      </Dialog>
      </>
      
    )
  }

  editTransaction = ()=> {
    return(
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
    )
  }

  deleteSplit = ()=>{
    return(
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
    )
  }

  deleteTransaction = ()=>{
    return(
      <AlertDialog open={this.state.openDeleteDialog}>
      <AlertDialogTrigger>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this transaction?</AlertDialogTitle>
          <AlertDialogDescription>
            `This action cannot be undone. This will permanently delete this transaction: 
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
    )
  }

  splitTransaction = ()=> {

    React.useEffect(() => {
      if (this.state.openSplitDialog) {
        this.fetchFriends();
      }
    }, [this.state.openSplitDialog]);

    const logSplit = ()=>{  
      this.setState({ openSplitDialog: false, loading: true });
      const req = {
        email: this.state.email,
        password: this.state.password,
        splits: this.state.splits,
        transactionId: this.state.currentTransaction.ID
      }
      const url = 'https://karchu.onrender.com/v2/split-transaction';
      const options: RequestInit = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: req ? JSON.stringify(req) : null,
      };
    
      fetch(url, options)
        .then((response) => response.json())
        .then((data) => {
          if (data.success_code) {
            this.setState({openSplitDialog:false})
            this.props.fetchTransactions()
            toast.success(data.success_message);
          } else if (data.error_code) {
            toast.error(data.error_message);
          } else {
            console.error('Unexpected response format:', data);
          }
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        })
        .finally(() => {
          // Introduce a small delay before setting loading to false
          setTimeout(() => {
            this.setState({
              openSplitDialog: false,
              splits: [
                {friendId: "", amount: 0}
              ],
              loading: false
            });
          }, 500); // Adjust the delay time as needed
        });
    }

    const handleInputChange = (index: number, type: string, value: number|string) => {
      this.setState((prevState) => {
        const updatedSplits = [...prevState.splits];
        if (index >= 0 && index < updatedSplits.length) {
          updatedSplits[index] = {
            ...updatedSplits[index],
            [type]: Number.isNaN(parseFloat(String(value)) )? 0 : parseFloat(String(value)),
          };
        }
        return { splits: updatedSplits };
      });
    };

    return(
      <Dialog open={this.state.openSplitDialog}>
          <DialogTrigger asChild>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader className='flex flex-row justify-between'>
              <div>
                <DialogTitle>Split Transaction</DialogTitle>
              </div>
              <div>
                <Button onClick={()=>{
                  this.setState((prevState) => ({
                    splits: [
                      ...prevState.splits,
                      { 
                        friendId: "",
                        amount: 0
                      }
                    ]
                  }));
                }}>
                    <PlusCircledIcon className="mr-2 h-4 w-4" /> Add Friend Split
                </Button>
              </div>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {
                <>
                  <div key={"Me"} className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor={"Me"} className="text-right col-span-2  ">  
                        {"Me"}
                      </Label>
                      <Input id={"My Value"} value={this.state.currentTransaction.Amount - this.state.splits.reduce((total, split) => total + split.amount, 0)} className="col-span-2" />
                  </div>
                  {
                    this.state.splits.map((split,index)=>(
                    <div  key={index} className="grid grid-cols-4 items-center gap-4">
                    <Select onValueChange={(value)=>{handleInputChange(index, "friendId", value)} } >
                      <SelectTrigger className="col-span-2">
                        <SelectValue placeholder="Select a friend" />
                      </SelectTrigger>
                      <SelectContent className='p-0 max-h-[250px] overflow-auto'>
                        <SelectGroup>
                          <SelectLabel>Friends</SelectLabel>
                          {this.state.friends.map((friend) => (
                            <SelectItem value={String(friend.FriendId)}>{friend.FriendName}</SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <Input id={split.friendId} value={split.amount} className="col-span-2" onChange={(e)=> {handleInputChange(index, "amount", e.target.value)}} />
                    </div>
                    ))
                  }
                </>
                  
              }
            </div> 
            <DialogFooter>
                  <Button type="button" variant="secondary" onClick={()=> { 
                      this.setState({
                        openSplitDialog:false,
                        splits:[
                        {friendId: "", amount: 0}
                        ]
                      })  
                    }}>
                    Close
                  </Button>
              <Button type="submit" onClick={()=> {logSplit()}}>Log Split</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    )
  }
  

  render() {
  
    return (
      <>
      <LoadingComponent loading={this.state.loading}></LoadingComponent>
      <div>       
        { this.state.openNewDialog &&<this.newTransaction /> }
        { this.state.openEditDialog && <this.editTransaction /> }
        { this.state.openDeleteSplitsDialog && <this.deleteSplit /> }
        { this.state.openDeleteDialog && <this.deleteTransaction /> }
        { this.state.openSplitDialog && <this.splitTransaction/>}
        <div className='flex'>
        <div className="w-3/4 card flex justify-content-center mx-4">
        <MultiSelect
          value={this.state.selectedCategories}
          onChange={(e) => {
            this.setState(() => ({
              selectedCategories: e.value,
            }));
            this.props.setCategoryFilters(
              e.value.map((category: { name: string }) => category.name)
            );
          }}
          options={this.state.categoryNames}
          optionLabel="name"
          display="chip"
          placeholder="Filter Category"
          maxSelectedLabels={7}
          className="w-full md:w-20rem text-sm"
          itemClassName='text-sm bg-slate-100'
        />

        </div>
       <div className="w-1/4 flex justify-end my-2">
          <Button onClick={()=> this.setState({openNewDialog:true})}>
            <PlusCircledIcon className="mr-2 h-4 w-4" /> Add Transaction
          </Button>            
       </div>
        </div>
        
       {
          this.state.Transactions.length === 0 ?
          <div className="flex items-center justify-center my-4">
              <p className="leading-7 [&:not(:first-child)]:mt-6 mx-au"> Add your first transaction</p>
          </div>
          :
          <ScrollArea className="h-screen w-full rounded-md border">
            <Table className='border-collapse border-l w-full'>
            <TableHeader>
              {this.headers.map((header) => (
                  <TableHead key={header} className={header === 'Amount' ? 'text-right' : 'text-center'}>
                      {header}
                  </TableHead>
              ))}
            </TableHeader>


                <TableBody className='overflow-y-auto'>
                  {this.state.Transactions.map((transaction) => {
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
                            <TableCell className="w-1/12 text-right text-green-600">₹{numeral(transaction.Amount).format('0,0.00')}</TableCell>
                          :
                          <TableCell className="w-1/12 text-right  text-red-600">₹{numeral(transaction.Amount).format('0,0.00')}</TableCell>
                        }
                        <TableCell className="w-1/6 text-center">{transaction.Description}</TableCell>
                        <TableCell className="w-1/6 text-center">
                          {
                            (transaction.SplitTag == "will split") ?
                            (
                              <div className='flex items-center justify-center text-yellow-700'>
                                            <TimerIcon />
                                            <span className='px-2'> {transaction.SplitTag} </span>
                              </div>
                            )
                            :
                            (
                              <div className='flex items-center justify-center text-green-600'>
                                            <CheckCircledIcon></CheckCircledIcon>
                                            <span className='px-2'> {transaction.SplitTag} </span>
                              </div>
                            )
                          }
                        </TableCell>
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
                                <DropdownMenuItem onClick={()=>{this.setState({openSplitDialog:true, currentTransaction: transaction})}}>Split Transaction</DropdownMenuItem>
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
          </ScrollArea>
            
       }
        
      </div>
                            
      </>
    );
  }
}

export default Transactions;
