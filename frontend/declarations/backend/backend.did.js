export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'getBestScore' : IDL.Func([], [IDL.Nat], ['query']),
    'updateBestScore' : IDL.Func([IDL.Nat], [IDL.Nat], []),
  });
};
export const init = ({ IDL }) => { return []; };
