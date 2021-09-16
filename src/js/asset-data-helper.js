
 import axios from 'axios'

const assetLookup = {

    "0xa7d8d9ef8d8ce8992df33d8b8cf4aebabd5bd270":{name:"Artblocks",chainId:1},
    "0x059edd72cd353df5106d2b9cc5ab83a52287ac3a":{name:"Chromie Squiggle",chainId:1},
 
    "0x388f486dbcbe05029ba7adf784459b580b427032":{name:"Chromie Squiggle",chainId:4}


}

const abProjectLookup = {

    0: 'Chromie Squiggles',
    1: 'Genesis', 
    2: 'Construction Token', 
    3: 'Cryptoblots', 
    4: 'Dynamic Slices', 
    5: 'Variant Plan', 
    6: 'View Card', 
    7: 'Elevated Deconstructions', 
    8: 'Singularity', 
    9: 'Ignition', 
    10: 'NimBuds', 
    11: 'HyperHash', 
    12: 'Unigrids', 
    13: 'Ringers', 
    14: 'Cyber Cities', 
    15: 'Utopia', 
    16: 'Color Study', 
    17: 'Spectron', 
    18: 'Gen 2', 
    19: 'R3sonance', 
    20: 'Sentience', 
    21: '27-Bit Digital', 
    22: 'The Eternal Pump', 
    23: 'Archetype', 
    24: 'Pixel Glass', 
    25: 'Pathfinders', 
    26: 'EnergySculpture', 
    27: '720 Minutes', 
    28: 'Apparitions', 
    29: 'Inspirals', 
    30: 'Hieroglyphs', 
    31: 'Galaxiss', 
    32: 'Light Beams', 
    33: 'Empyrean', 
    34: 'Ensō', 
    35: 'Aerial View', 
    36: 'Gazettes', 
    37: 'Paper Armada', 
    38: 'ByteBeats', 
    39: 'Synapses', 
    40: 'Algobots', 
    41: 'Elementals', 
    42: 'Void', 
    43: 'Origami Dream', 
    44: 'CryptoGodKing', 
    45: 'Gravity Grid', 
    46: '70s Pop Series One', 
    47: 'Asterisms', 
    48: 'Gen 3', 
    49: 'Dear Hash,', 
    50: 'The Opera', 
    51: 'Stipple Sunsets', 
    52: 'Star Flower', 
    53: 'Subscapes', 
    54: 'P:X', 
    55: 'Talking Blocks', 
    56: 'Aurora IV', 
    57: 'Rhythm', 
    58: 'Color Magic Planets', 
    59: 'Watercolor Dreams', 
    60: 'Event Horizon Sunset (Series C)', 
    61: '70s Pop Super Fun Summertime Bonus Pack', 
    62: 'Bubble Blobby', 
    63: 'Ode to Roy', 
    64: 'AlgoRhythms', 
    65: 'Traversals', 
    66: 'Patchwork Saguaros', 
    67: 'Petri', 
    68: 'Messengers', 
    69: 'Abstraction', 
    70: 'Antennas', 
    71: 'Andradite', 
    72: 'Frammenti', 
    73: 'CatBlocks', 
    74: 'The Blocks of Art', 
    75: 'Breathe You', 
    76: 'dino pals', 
    77: 'Return', 
    78: 'Fidenza', 
    79: 'Space Debris [maider]', 
    80: 'Space Debris [warning]', 
    81: 'Space Debris [ravaged]', 
    82: 'Incantation', 
    83: 'Panelscape', 
    84: 'PrimiDance', 
    85: '70s Pop Series Two', 
    86: 'Stroming', 
    87: 'Patterns of Life', 
    88: 'Orthogone', 
    89: 'Dreams', 
    90: 'Hashtractors', 
    91: 'planets', 
    92: 'Libertad Parametrizada', 
    93: 'Sigils', 
    94: 'Portal', 
    95: 'CryptoVenetian', 
    96: 'Gravity 12', 
    97: '[Dis]entanglement', 
    98: 'sail-o-bots', 
    99: 'Spaghettification', 
    100: 'CENTURY', 
    101: 'Enchiridion', 
    102: 'I Saw It in a Dream', 
    103: 'Octo Garden', 
    104: 'Eccentrics', 
    105: 'Gizmobotz', 
    106: 'Radiance', 
    107: 'Low Tide', 
    108: 'Divisions', 
    109: 'Speckled Summits', 
    110: 'Lava Glow', 
    111: '70s Pop Ghost Bonus Pack', 
    112: 'Alien Clock', 
    113: 'celestial cyclones', 
    114: 'glitch crystal monsters', 
    115: '?',
    116: 'Flowers',
    117: 'Transitions',
    118: 'LeWitt Generator Generator',
    119: 'Ecumenopolis',
    120: 'Endless Nameless',
    121: 'Rinascita',
    122: 'Cells',
    123: 'Nucleus',
    124: 'The Liths of Sisyphus',
    125: 'Calendart',
    126: 'Timepiece',
    127: 'Labyrometry',
    128: '?',
    129: 'Pigments',
    130: 'Obicera',
    131: 'Scribbled Boundaries',
    132: 'Tangled',
    133: 'Organized Disruption',
    134: 'Wave Schematics',
    135: 'Brushpops',
    136: 'SpiroFlakes',
    137: 'Alien Insects',
    138: 'Geometry Runners',
    139: 'Eccentrics 2: Orbits',
    140: 'Good Vibrations',
    141: 'Rapture',
    142: 'Unknown Signals',
    143: 'phase',
    144: 'autoRAD',
    145: 'Beatboxes',
    146: 'Neighborhood',
    147: 'Trossets',
    148: '?',
    149: 'Dot Matrix Gradient Study',
    150: 'PrimiLife',
    151: 'High Tide',
    152: 'Fake Internet Money',
    153: '?',
    154: 'Warp',
    155: '?',
    156: 'Moments',
    157: 'UltraWave 369',
    158: '?',
    159: 'Fragments of an Infinite Field'

}


const ArtblocksCuratedProjectIds = [0,7,8,9,10,159]
const ArtblocksFactoryProjectIds = []
const ArtblocksPlaygroundProjectIds = []


export default class AssetDataHelper {

    static getCollectionNameForAsset( contractAddress, tokenId   )
    {
        let assetLookupData = assetLookup[contractAddress.toLowerCase()]

        if(assetLookupData){
            let contractName = assetLookupData.name 

            return contractName
        }
  
          return 'Unknown'
  
      }

      static getProjectNameForProjectId( projectId   )
  {

        let projectName = abProjectLookup[projectId]
        
        if(projectName){
            return projectName 
        }

        return 'Unknown'    
  }

  static getProjectNameForAsset( contractAddress, tokenId   )
  {

    let assetLookupData = assetLookup[contractAddress.toLowerCase()]

    if(assetLookupData){
        let contractName = assetLookupData.name 

        if(contractName == "Chromie Squiggle" ){
            return 'Chromie Squiggle'
        }

        if(contractName == "Artblocks" ){
            let projectId = parseInt(tokenId) / 1000000   //one million 

            let projectName = abProjectLookup[projectId]
            
            if(projectName){
                return projectName 
            }
            
        }

        return 'Unknown'

    }

    contractAddress = contractAddress.toLowerCase()

     
  }


  static getProjectDataForProjectId(projectId){

    return {name: AssetDataHelper.getProjectNameForProjectId(projectId) }

  }
/*
  static async fetchProjectDataForProjectId(projectId){
    let previewTokenId = projectId * 1000000 

    return await  AssetDataHelper.fetchProjectDataForTokenId( previewTokenId  )

    
    }


  static async fetchProjectDataForTokenId(tokenId){

    return axios.get(`https://token.artblocks.io/${tokenId}`);

  }*/
 





}