export const idlFactory = ({ IDL }) => {
  return IDL.Service({ 'whoami' : IDL.Func([], [IDL.Text], []) });
};
export const init = ({ IDL }) => { return []; };
