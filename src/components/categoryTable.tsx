import { Component } from 'react';
import { toast } from "sonner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import numeral from 'numeral';
import {
  DotsHorizontalIcon,
  PlusCircledIcon
} from "@radix-ui/react-icons"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  import { Button } from "@/components/ui/button"
import { ScrollArea } from '@radix-ui/react-scroll-area';


interface NetCategory {
    Category: string;
    NetAmount: number;
}

interface TransactionsProps {
  categories: NetCategory[];
  fetchTransactions: ()=> void;
  email: string|null;
  password: string|null
}

interface NewCategory{
  category: string
}

interface TransactionsState {
  categories: NetCategory[];
  openDeleteDialog: boolean;
  openEditDialog: boolean;
  currentCategory: NetCategory;
  openDeleteSplitsDialog: boolean;
  openNewCatDialog: boolean;
  newCategory: NewCategory;
  email: string|null;
  password: string|null
}

class CategoryTable extends Component<TransactionsProps, TransactionsState> {
  constructor(props: TransactionsProps) {
    super(props);
    this.state = {
        categories: props.categories,
        openDeleteDialog: false,
        openEditDialog: false,
        openDeleteSplitsDialog: false,
        currentCategory: {
          Category: "",
          NetAmount: 0,
        },
        openNewCatDialog: false,
        newCategory: {
          category: ""
        },
        email: props.email,
        password: props.password
    };
  }

  componentDidUpdate(prevProps: TransactionsProps): void {
    if (prevProps.categories !== this.props.categories) {
      // Update state when transactions prop changes
      this.setState({ categories: this.props.categories });
    }
  }

  headers = [
    "Category",
    "Amount Spent",
    "Actions"
  ]

  newCategory = ()=>{

    const handleInputChange = (key: string, value: string) => {
      this.setState((prevState) => ({
        newCategory: {
          ...prevState.newCategory,
          [key]: value,
        },
      }));
      console.log(this.state.newCategory)
    }

    const createCategory = () => {
      const req = {
        email: this.state.email,
        password: this.state.password,
        categoryName: this.state.newCategory.category
      }
      const url = 'https://karchu.onrender.com/v1/categories';
      const options: RequestInit = {
        method: 'POST',
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
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
      this.setState({openNewCatDialog:false})
    }

    return(
          <Dialog open={this.state.openNewCatDialog}>
            <DialogTrigger asChild>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>New Category</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div key="category" className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                        Category
                  </Label>
                  <Input id="category" value={this.state.newCategory.category} className="col-span-3" onChange={(e) => handleInputChange("category", e.target.value)} />
                </div>
              </div>
              <DialogFooter>
                    <Button type="button" variant="secondary" onClick={()=> this.setState({openNewCatDialog:false})}>
                      Close
                    </Button>
                <Button type="submit" onClick={createCategory}>Create Category</Button>
              </DialogFooter>
              <p className="leading-7 [&:not(:first-child)]:mt-6 text-red-500">{}</p>
            </DialogContent>
          </Dialog>
      );
  }

  render() {

    return (
      <>
      <div>
      < this.newCategory></this.newCategory>
      <div className="w-full grid justify-items-end my-2">
                <Button onClick={()=> this.setState({openNewCatDialog:true})}>
                    <PlusCircledIcon className="mr-2 h-4 w-4" /> Add Category
                </Button>
            </div>
          {
             this.state.categories.length === 0 ?
                <div className="flex items-center justify-center my-4">
                    <p className="leading-7 [&:not(:first-child)]:mt-6 mx-au"> Add Category </p>
                </div>
             :
             <ScrollArea className='h-[475px] w-full rounded-md border' style={{ overflow: 'auto' }}>
                <Table className='w-full border-collapse border-l'>
                  <TableHeader>
                      <TableRow>
                      {this.headers.map((h) => (
                          h == "Amount Spent" ?  <TableHead className='text-right' key={h}>{h}</TableHead> :
                          <TableHead className='text-center' key={h}>{h}</TableHead>
                      ))}
                      </TableRow>
                  </TableHeader>
                  <TableBody >
                      {this.state.categories.map((category, index) => {  
                      return (
                          <TableRow key={index}>
                              <TableCell className="w-1/12 text-center">{category.Category}</TableCell>
                              <TableCell className="w-1/12 text-right">₹{numeral(category.NetAmount).format('0,0.00')}</TableCell>
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
                                              <DropdownMenuItem >New Category</DropdownMenuItem>
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

export default CategoryTable;
