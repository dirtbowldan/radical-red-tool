import { useEffect, useState } from "react";
import { speciesData } from "./speciesData";
import { pokemonArray } from "./pokemonArray";
import { Popper, Box } from "@mui/material";
import { moveData } from "./moves";
import { abilityData } from "./abilities";
import React from "react";
import MyTeam from "./myTeam";
import SpeciesTable from "./speciesTable";
import "./App.css";
function Species() {
  const [pokemon, setPokemon] = useState(pokemonArray);
  const [myTeam, setMyTeam] = useState(
    JSON.parse(localStorage.getItem("myTeam"))
  );
  const [sortField, setSortField] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [currentList, setCurrentList] = useState(pokemonArray);
  const [anchorEl, setAnchorEl] = React.useState("");
  const [open, setOpen] = useState(false);
  const [myTeamOpen, setMyTeamOpen] = useState(false);
  const id = open ? "simple-popper" : undefined;
  let eventnow = "";

  useEffect(() => {}, [myTeam]);

  return (
    <div className="main">
      <div className="tableContainer">
        <SpeciesTable
          pokemonArray={pokemon}
          updatePokemon={setMyTeam}
          tableTitle="All Pokemon"
        />
      </div>
      <div className="tableContainer">
        <MyTeam
          pokemonArray={myTeam}
          updatePokemon={setMyTeam}
          tableTitle="My Team"
        />
      </div>
    </div>
  );
}

export default Species;
