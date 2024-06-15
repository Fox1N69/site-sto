import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
} from "@nextui-org/dropdown";
import { Link } from "@nextui-org/link";
import { NavbarMenuItem } from "@nextui-org/navbar";

interface SearchResult {
  id: number;
  name: string;
}

export const SearchBart: React.FC<SearchResult> = ({ id, name }) => {
  return (
    <DropdownMenu>
      <NavbarMenuItem key={id}>
        <Link href={`/autoparts/${id}`} size="lg">{name}</Link>
      </NavbarMenuItem>
    </DropdownMenu>
  );
};
