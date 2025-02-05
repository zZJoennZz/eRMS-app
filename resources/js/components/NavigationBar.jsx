import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

import {
    ArchiveBoxIcon,
    HomeModernIcon,
    ListBulletIcon,
    TableCellsIcon,
    DocumentTextIcon,
    Cog6ToothIcon,
    BarsArrowDownIcon,
    ArrowUpOnSquareIcon,
    UserGroupIcon,
} from "@heroicons/react/24/solid";

export default function NavigationBar() {
    const { currId } = useContext(AuthContext);

    const menu = [
        {
            id: 1,
            icon: <HomeModernIcon className="inline h-5 w-5 mr-4" />,
            text: "Home",
            to: "/dashboard",
        },
        {
            id: 3,
            icon: <TableCellsIcon className="inline h-5 w-5 mr-4" />,
            text: "Transactions",
            to: "/transactions",
        },
        {
            id: 8,
            icon: <BarsArrowDownIcon className="inline h-5 w-5 mr-4" />,
            text: "ASWS",
            to: "/asws",
        },
        {
            id: 4,
            icon: <ArchiveBoxIcon className="inline h-5 w-5 mr-4" />,
            text: "Inventory",
            to: "/inventory",
        },
        {
            id: 6,
            icon: <DocumentTextIcon className="inline h-5 w-5 mr-4" />,
            text: "Paper Consumption",
            to: "/paper-consumption",
        },
        {
            id: 9,
            icon: <ArrowUpOnSquareIcon className="inline h-5 w-5 mr-4" />,
            text: "Releases",
            to: "/releases",
        },
        {
            id: 2,
            icon: <ListBulletIcon className="inline h-5 w-5 mr-4" />,
            text: "Master Lists",
            to: "/masterlists",
        },
        {
            id: 7,
            icon: <Cog6ToothIcon className="inline h-5 w-5 mr-4" />,
            text: "Branch Settings",
            to: "/settings",
        },
    ];

    return (
        <ul className="mt-16 md:mt-5">
            {menu.map((m) => (
                <LinkWithDesign
                    key={m.id}
                    icon={m.icon}
                    text={m.text}
                    to={m.to}
                />
            ))}
            {currId === 1 && (
                <LinkWithDesign
                    icon={<UserGroupIcon className="inline h-5 w-5 mr-4" />}
                    text="Users"
                    to="/users"
                />
            )}
        </ul>
    );
}

function LinkWithDesign({ icon, text, to }) {
    return (
        <li className="group">
            <Link
                to={to}
                className="text-white flex items-center group-hover:text-emerald-700 group-hover:bg-white transition-all ease-in-out duration-300 uppercase font-medium py-2 pl-4 md:mb-1 rounded-xl"
            >
                {icon}
                {text}
            </Link>
        </li>
    );
}
