import { Component } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import numeral from 'numeral';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  import { Button } from "@/components/ui/button"
  import {
    DotsHorizontalIcon,
  } from "@radix-ui/react-icons"
interface NetCategory {
    Category: string;
    NetAmount: number;
}

interface TransactionsProps {
  categories: NetCategory[];
  fetchTransactions: ()=> void
}

interface TransactionsState {
  categories: NetCategory[];
  openDeleteDialog: boolean;
  openEditDialog: boolean;
  currentCategory: NetCategory;
  openDeleteSplitsDialog: boolean
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
      }
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

  render() {
    if (this.state.categories.length === 0) {
      return null; // or some other fallback UI when there are no transactions
    }

    return (
      <div className=" flex lg:flex-row sm:flex-col">
        <div className='lg:w-1/3 sm:w-full'>
            <Table>
                <TableHeader>
                    <TableRow>
                    {this.headers.map((h) => (
                        h == "Amount Spent" ?  <TableHead className='text-right' key={h}>{h}</TableHead> :
                        <TableHead className='text-center' key={h}>{h}</TableHead>
                    ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
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
        </div>
        <div className='w-2/3'>

        </div>
      </div>
    );
  }
}

export default CategoryTable;
