const convertQuoteToInvoice = async (req: any, res: any) => {
  return res.status(200).json({
    success: true,
    result: null,
    message: 'Please Upgrade to Premium  Version to have full features',
  });
};

export default convertQuoteToInvoice;
