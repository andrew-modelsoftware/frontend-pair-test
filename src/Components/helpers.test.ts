import { formatDateTime } from "./helpers";

test(`returns the provided datetime string 
in the format 'dd/mm/yyyy' format in the local timezone`, () => {
  // Arrange
  const dateTime: string = '2020-12-20T22:30:00-08:00';

  // Act
  const result = formatDateTime(dateTime)

  // Assert
  expect(result).toEqual('21/12/2020')
})
