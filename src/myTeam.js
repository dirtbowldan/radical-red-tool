import { useEffect, useState } from "react";
import { speciesData } from "./speciesData";
import { pokemonArray } from "./pokemonArray";
import { Popper, Box } from "@mui/material";
import { moveData } from "./moves";
import { abilityData } from "./abilities";
import React from "react";
import "./App.css";
function MyTeam(props) {
  const [pokemonHTML, setPokemonHTML] = useState([]);
  const [pokemon, setPokemon] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [currentList, setCurrentList] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState("");
  const [open, setOpen] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const id = open ? "simple-popper" : undefined;
  const [maxEv, setMaxEv] = useState(false);
  const [sortDirection, setSortDirection] = useState(false);
  const [sort, setSort] = useState(false);
  let eventnow = "";
  let sortBy = "";
  const splitIcon = (split) => {
    let link = "";
    switch (split) {
      case "SPLIT_PHYSICAL":
        link =
          "https://archives.bulbagarden.net/media/upload/9/92/PhysicalIC_HGSS.png";
        break;
      case "SPLIT_SPECIAL":
        link =
          "https://archives.bulbagarden.net/media/upload/8/80/SpecialIC_HGSS.png";
        break;

      case "SPLIT_STATUS":
        return "https://archives.bulbagarden.net/media/upload/f/f6/StatusIC_HGSS.png  ";
    }
    return link;
  };

  useEffect(() => {
    if (props.pokemonArray) {
      setPokemon(props.pokemonArray);
      setCurrentList(props.pokemonArray);
    }
  }, [props.pokemonArray]);

  useEffect(() => {
    if (pokemon) {
      createTable(pokemon);
    }
  }, [pokemon]);

  useEffect(() => {
    if (pokemonHTML) {
      handleSearch(searchValue);
    }
  }, [searchValue]);

  useEffect(() => {
    if (sort) {
      sortPokemon(sortBy);
    }
    handleSearch(searchValue);
  }, [currentList]);

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  function sanitizeEffect(effect) {
    let neweffect = "";

    neweffect = effect
      .replace("SPECIAL_ATTACK_", "SpA")
      .replace("SPECIAL_DEFENSE_", "SpD")
      .replace("ATTACK_", "Att")
      .replace("DEFENSE_", "Def")
      .replace("SPEED_", "Spe");

    neweffect = neweffect.replace("_", "");
    neweffect = capitalizeFirstLetter(neweffect);
    neweffect = neweffect.replace("up", " ↑").replace("down", " ↓");
    return neweffect;
  }

  const handleClick = (event) => {
    if (event.currentTarget === eventnow) {
      setOpen((prev) => !prev);
    } else {
      setOpen(true);
    }
    setAnchorEl(event.currentTarget);
    eventnow = event.currentTarget;
  };

  const sortPokemon = (event) => {
    if (event.currentTarget) {
      sortBy = event.currentTarget.id;
    } else {
      sortBy = event;
    }

    setSortDirection(true);
    console.log(sortBy);
    console.log(!sortDirection);
    if (sortBy === event.currentTarget.id) {
      setSortDirection(!sortDirection);
    }

    let sorted = [...currentList].sort((a, b) => {
      if (sortDirection) {
        if (a[sortBy] < b[sortBy]) {
          return -1;
        } else {
          return 1;
        }
      } else {
        if (a[sortBy] < b[sortBy]) {
          return 1;
        } else {
          return -1;
        }
      }
    });
    setCurrentList(sorted);
  };
  const handleSearchInput = (event) => {
    const value = event.target.value;
    console.log(value);
    setSearchValue(value);
  };
  const handleSearch = (searchValue) => {
    setSearchActive(true);
    if (searchValue !== "") {
      const filteredArray = currentList.filter((pokemono) => {
        return pokemono.name.includes(searchValue.toUpperCase());
      });
      setPokemon(filteredArray);
    } else {
      if (searchValue === "" && searchActive) {
        setSearchActive(false);
      }
      setPokemon(currentList);
    }
  };
  const evolvePokemon = (event) => {
    event.stopPropagation();
    let pokemonname = event.currentTarget.getAttribute("id");
    let currentTeam = JSON.parse(localStorage.getItem("myTeam"));
    let index = currentTeam.findIndex((pokemon) => {
      return pokemon.name === pokemonname;
    });
    let evolution = currentTeam[index].evolution[0][2];
    console.log(evolution);
    console.log(currentTeam);
    currentTeam[index] = speciesData[evolution];
    props.updatePokemon(currentTeam);
    localStorage.setItem("myTeam", JSON.stringify(currentTeam));
  };
  const removePokemon = (event) => {
    event.stopPropagation();
    let pokemonname = event.currentTarget.getAttribute("id");
    let currentTeam = JSON.parse(localStorage.getItem("myTeam"));
    const filtered = currentTeam.filter((poke) => poke.name !== pokemonname);
    props.updatePokemon(filtered);
    localStorage.setItem("myTeam", JSON.stringify(filtered));
    // createTable(filtered);
  };
  const handleMaxEvoFilter = (event) => {
    if (maxEv === false) {
      setMaxEv(true);
      const filteredArray = pokemon.filter((pokemon) => {
        if (pokemon.evolution.length === 0) {
          return true;
        } else {
          if (pokemon.evolution[0][0] === "EVO_MEGA") {
            return true;
          } else {
            return false;
          }
        }
      });

      setCurrentList(filteredArray);
    } else {
      setMaxEv(false);
      setCurrentList(props.pokemonArray);
    }
  };

  const resetTable = () => {
    if (props.tableTitle === "My Team") {
      createTable(JSON.parse(localStorage.getItem("myTeam")));
      setCurrentList(JSON.parse(localStorage.getItem("myTeam")));
    } else {
      // createTable(pokemonArray);
      setCurrentList(pokemonArray);
    }
  };

  const createTable = (array) => {
    let pokemonlist = array.map((species, i) => {
      return (
        <div onClick={handleClick} id={species.name}>
          <div key={i} className="listItem">
            <div className="speciesName">
              <img
                height={30}
                width={30}
                src={
                  "https://raw.githubusercontent.com/dirtbowldan/Radical-Red-Sprites/main/PokemonSprites/spriteSPECIES_" +
                  species.name +
                  ".png"
                }
              />
              <div className="text">{capitalizeFirstLetter(species.name)}</div>
            </div>
            <div className="speciesType">
              <div className={`text typing ${species.type1}`}>
                {species.type1}
              </div>
              {species.type1 === species.type2 ? (
                ""
              ) : (
                <div className={`text typing ${species.type2}`}>
                  {species.type2}
                </div>
              )}
            </div>
            <div className="speciesAbilities">
              {species.abilities.map((ab, i) => {
                let abs = abilityData[ab].ingameName;
                return <div>{abs}</div>;
              })}
            </div>
            <div className="baseStat">
              <div className="text">{species.baseHP}</div>
            </div>
            <div className="baseStat">
              <div className="text"> {species.baseAttack}</div>
            </div>
            <div className="baseStat">
              <div className="text">{species.baseDefense}</div>
            </div>
            <div className="baseStat">
              <div className="text">{species.baseSpAttack}</div>
            </div>
            <div className="baseStat">
              <div className="text">{species.baseSpDefense}</div>
            </div>
            <div className="baseStat">
              <div className="text">{species.baseSpeed}</div>
            </div>
            <div className="baseStat">
              <div className="text">{species.BST}</div>
            </div>

            <div className="listButton">
              <button
                className="addButton"
                id={species.name}
                onClick={removePokemon}
              >
                Remove
              </button>
              {species.evolution.length > 0 ? (
                <button
                  className="addButton"
                  id={species.name}
                  onClick={evolvePokemon}
                >
                  Evolve
                </button>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      );
    });
    setPokemonHTML(pokemonlist);
  };

  return (
    <div className="App">
      <h2>{props.tableTitle}</h2>
      <div>
        <label className="searchTitle">Search: </label>
        <input type="text" onChange={handleSearchInput} />
      </div>
      <div>
        <label className="searchTitle">Max Evolution </label>
        <input checked={maxEv} type="checkbox" onChange={handleMaxEvoFilter} />
      </div>
      <div className="listItem">
        <div onClick={sortPokemon} id="name" className="speciesName">
          <img width={0} src={""} />
          <div className="text">Name</div>
        </div>
        <div className="speciesType">
          <div className={`text typing`}>Type</div>
        </div>
        <div className="abilityHeader">
          <div>Abilities</div>
        </div>
        <div onClick={sortPokemon} id="baseHP" className="baseStat headerStat">
          <div className="text">HP</div>
        </div>
        <div
          onClick={sortPokemon}
          id="baseAttack"
          className="baseStat headerStat"
        >
          <div onClick={sortPokemon} id="baseDefense" className="text">
            Att
          </div>
        </div>
        <div
          onClick={sortPokemon}
          id="baseDefense"
          className="baseStat headerStat"
        >
          <div className="text">Def</div>
        </div>
        <div
          onClick={sortPokemon}
          id="baseSpAttack"
          className="baseStat headerStat"
        >
          <div className="text">SpA</div>
        </div>
        <div
          onClick={sortPokemon}
          id="baseSpDefense"
          className="baseStat headerStat"
        >
          <div className="text">SpD</div>
        </div>
        <div
          onClick={sortPokemon}
          id="baseSpeed"
          className="baseStat headerStat"
        >
          <div className="text">Spe</div>
        </div>
        <div onClick={sortPokemon} id="BST" className="baseStat headerStat">
          <div className="text">BST</div>
        </div>
        <div className="addButton">Add</div>
        <Popper
          id={id}
          open={open}
          anchorEl={anchorEl}
          placement={"bottom-start"}
        >
          <Box
            className="moveBox"
            sx={{
              border: 1,
              p: 1,
              bgcolor: "background.paper",
            }}
          >
            <div>
              <h4>
                {anchorEl ? speciesData[anchorEl.getAttribute("id")].name : ""}
              </h4>
              <h5>Evolutions</h5>
              <div>
                {anchorEl
                  ? speciesData[anchorEl.getAttribute("id")].evolution.map(
                      (line) => {
                        if (line[0] === "EVO_TRADE_ITEM") {
                          return "";
                        } else {
                          return (
                            <div className="evoLine">
                              {`${line[0]
                                .replace("EVO_LEVEL", "Lv: ")
                                .replace("EVO_", "")
                                .replace("_", " ")}
                        ${line[1].replace("ITEM_", "").replace("_", " ")} → 
                        ${line[2]}`}
                              <img
                                height={30}
                                src={
                                  "https://raw.githubusercontent.com/dirtbowldan/Radical-Red-Pokedex-Data/main/PokemonSprites/spriteSPECIES_" +
                                  line[2] +
                                  ".png"
                                }
                              />
                            </div>
                          );
                        }
                      }
                    )
                  : ""}
              </div>
              <h5>Level Up Moves</h5>
              {anchorEl !== ""
                ? speciesData[anchorEl.getAttribute("id")].levelUpLearnsets.map(
                    (move) => {
                      return (
                        <div
                          title={moveData[move[0]].description}
                          className="moveData"
                        >
                          <img src={splitIcon(moveData[move[0]].split)} />
                          <div
                            className={
                              "moveType " +
                              moveData[move[0]].type.replace("TYPE_", "")
                            }
                          >
                            {moveData[move[0]].type.replace("TYPE_", "")}
                          </div>

                          <div className="moveName">
                            {moveData[move[0]].ingameName}
                          </div>
                          <div className="moveEffect">
                            {moveData[move[0]].power !== "0"
                              ? moveData[move[0]].power
                              : sanitizeEffect(
                                  moveData[move[0]].effect.replace(
                                    "EFFECT_",
                                    ""
                                  )
                                )}
                          </div>
                          <div className="moveLv">
                            {moveData[move[0]].accuracy}
                          </div>
                          <div className="moveLv">{"Lv: " + move[1]}</div>
                        </div>
                      );
                    }
                  )
                : ""}
            </div>
            <div>
              <h5>TM / HM</h5>
              {anchorEl !== ""
                ? speciesData[anchorEl.getAttribute("id")].TMHMLearnsets.map(
                    (move) => {
                      return (
                        <div
                          title={moveData[move].description}
                          className="moveData"
                        >
                          <img src={splitIcon(moveData[move].split)} />
                          <div
                            className={
                              "moveType " +
                              moveData[move].type.replace("TYPE_", "")
                            }
                          >
                            {moveData[move].type.replace("TYPE_", "")}
                          </div>

                          <div className="moveName">
                            {moveData[move].ingameName}
                          </div>
                          <div className="moveEffect">
                            {moveData[move].power !== "0"
                              ? moveData[move].power
                              : sanitizeEffect(
                                  moveData[move].effect.replace("EFFECT_", "")
                                )}
                          </div>
                        </div>
                      );
                    }
                  )
                : ""}
            </div>
            <div>
              <h5>Egg Moves</h5>
              {anchorEl !== ""
                ? speciesData[
                    anchorEl.getAttribute("id")
                  ].eggMovesLearnsets.map((move) => {
                    return (
                      <div
                        title={moveData[move].description}
                        className="moveData"
                      >
                        <img src={splitIcon(moveData[move].split)} />
                        <div
                          className={
                            "moveType " +
                            moveData[move].type.replace("TYPE_", "")
                          }
                        >
                          {moveData[move].type.replace("TYPE_", "")}
                        </div>

                        <div className="moveName">
                          {moveData[move].ingameName}
                        </div>
                        <div className="moveEffect">
                          {moveData[move].power !== "0"
                            ? moveData[move].power
                            : sanitizeEffect(
                                moveData[move].effect.replace("EFFECT_", "")
                              )}
                        </div>
                      </div>
                    );
                  })
                : ""}
            </div>
          </Box>
        </Popper>
      </div>
      {pokemonHTML}
    </div>
  );
}

export default MyTeam;
