import {
	registerDecorator,
	ValidationOptions,
	ValidationArguments,
} from 'class-validator';

export function Match(property: string, validationOptions?: ValidationOptions) {
	return function (object: object, propertyName: string) {
		registerDecorator({
			name: 'match',
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			constraints: [property],
			validator: {
				validate(value: unknown, args: ValidationArguments) {
					const [relatedPropertyName] = args.constraints as [string];
					// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
					return value === (args.object as any)[relatedPropertyName];
				},
				defaultMessage(args: ValidationArguments) {
					const [relatedPropertyName] = args.constraints as [string];
					return `${propertyName} must match ${relatedPropertyName}`;
				},
			},
		});
	};
}
