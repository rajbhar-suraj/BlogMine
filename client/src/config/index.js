export const registerControls = [
    { id: 1, type: 'text', name: 'name', placeholder: 'Enter you username', label: 'Username' },
    { id: 2, type: 'email', name: 'email', placeholder: 'Enter you email', label: 'Email' },
    { id: 3, type: 'password', name: 'password', placeholder: 'Enter you password', label: 'Password' },
]
export const loginControls = [
    { id: 1, type: 'email', name: 'email', placeholder: 'Enter you email', label: 'Email' },
    { id: 2, type: 'password', name: 'password', placeholder: 'Enter you password', label: 'Password' },
]
export const blogControls = [
    {type:'file',name:'image',label:'Image'},
    {type:'text',name:'title',placeholder:'Title',label:'Choose a name for you blog'},
    {type:'text-area',name:'content',placeholder:'Content goes here...',label:'Share your experience'}
]
export const commentControls =[{type:'text',name:'comments',label:'Comment',placeholder:'give your opinion...'}]

// data/reportOptions.js (optional file for reuse)
export const reportOptions = [
    { id: 'spam', label: 'Spam or misleading' },
    { id: 'inappropriate', label: 'Inappropriate content' },
    { id: 'harassment', label: 'Harassment or hate speech' },
    { id: 'violence', label: 'Promotes violence or harm' },
    { id: 'copyright', label: 'Copyright violation' },
    { id: 'other', label: 'Other' },
  ];
  